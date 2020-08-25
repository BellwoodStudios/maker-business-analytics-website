import { Stat, StatTypes, StatTargets, Block, StatData, StatDataItem } from 'api/model';
import { parseDaiSupply, ilkSpotToPrice, fromRad, parseFeesCollected } from 'utils/MathUtils';
import { getVaults } from 'api';
import { transpose } from 'utils';
import { Query } from '../../../../model';

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

    async fetch (query) {
        // Fetch all ilks in advance
        const args = query.toGraphQLFilter();
        const results = await Query.multiQuery(getVaults().map(v => {
            return `
                timeIlkSnapshots(ilkIdentifier:"${v.identifier}", ${args}) {
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
        }));

        // Parse each ilk that fits the filter
        const data = results.map(d => {
            let lastRate = null;
            let lastArt = null;

            return d.nodes.filter(n => n != null && query.filterByIlk(n)).map(n => {
                const row = new StatDataItem({
                    block: new Block(n),
                    value: 1,
                    extraData: {
                        ...n,
                        // Add in computed fields
                        dai: n.art != null ? parseDaiSupply(n.art, n.rate) : 0,
                        feesCollected: (n.art != null && n.rate != null) ? parseFeesCollected(lastArt, n.art, lastRate, n.rate) : 0,
                        price: n.spot != null && n.mat != null ? ilkSpotToPrice(n.spot, n.mat) : null,
                        debtCeiling: n.line != null ? fromRad(n.line) : 0
                    }
                });

                lastRate = n.rate;
                lastArt = n.art;

                return row;
            });
        }).filter(d => d.length > 0);

        // Combine them across ilks
        const mergedData = transpose(data).map(row => row.reduce((val, curr) => {
            const vd = val.extraData;
            const cd = curr.extraData;

            vd.dai += cd.dai;
            vd.feesCollected += cd.feesCollected;
            vd.debtCeiling += cd.debtCeiling;
            
            return val;
        }));

        return new StatData({
            stat: this,
            data: mergedData
        });
    }

}