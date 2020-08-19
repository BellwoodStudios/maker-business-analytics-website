import { Stat, StatTypes, StatTargets, Block, StatData, StatDataItem } from 'api/model';
import { parseDaiSupply, ilkSpotToPrice, fromRad, parseFeesCollected } from 'utils/MathUtils';
import { fetchGraphQL, getVaults } from 'api';
import { arraySum, arrayAvg } from 'utils';

/**
 * Fetch time series on all the high-level ilk stats. Not to be used directly, but instead as a common stat dependency.
 */
export default class IlkSnapshotStat extends Stat {

    constructor () {
        super({
            type: StatTypes.VALUE,
            targets: StatTargets.ALL
        });
    }

    combine (values) {
        // Remove any empty blocks
        values = values.filter(v => v != null);

        if (values.length === 0) return null;
        if (values.length === 1) return values[0];

        const largestBlock = values.reduce((value, curr) => value == null || curr.block.number > value.number ? curr.block : value, null);
        
        return {
            block: largestBlock,
            value: 1,
            extraData: {
                dai: arraySum(values.map(v => v.extraData.dai)),
                feesCollected: arraySum(values.map(v => v.extraData.feesCollected)),
                price: arrayAvg(values.map(v => v.extraData.price)),
                debtCeiling: arraySum(values.map(v => v.extraData.debtCeiling))
            }
        };
    }

    async fetch (query) {
        const args = query.toGraphQLFilter();

        const result = await fetchGraphQL("{" + getVaults().map(v => {
            return `
                i${v.id}: timeIlkSnapshots(ilkIdentifier:"${v.identifier}", ${args}) {
                    nodes {
                        ilkIdentifier,
                        blockNumber,
                        updated,
                        rate,
                        art,
                        spot,
                        line,
                        rho,
                        duty,
                        mat
                    }
                }
            `;
        }).join(",") + "}");

        const data = Object.values(result.data).map(d => {
            let lastRate = null;
            let lastArt = null;

            return d.nodes.filter(n => n != null && query.filterByIlk(n)).map(n => {
                const row = new StatDataItem({
                    block: new Block(n),
                    value: 1,
                    extraData: {
                        ...n,
                        group: n.ilkIdentifier,
                        // Add in computed fields
                        dai: n.art != null ? parseDaiSupply(n.art, n.rate) : null,
                        feesCollected: (n.art != null && n.rate != null) ? parseFeesCollected(lastArt, n.art, lastRate, n.rate) : 0,
                        price: n.spot != null && n.mat != null ? ilkSpotToPrice(n.spot, n.mat) : null,
                        debtCeiling: n.line != null ? fromRad(n.line) : null
                    }
                });

                lastRate = n.rate;
                lastArt = n.art;

                return row;
            });
        }).flat();

        return new StatData({
            stat: this,
            data: data
        }).mergeByGroup();
    }

}