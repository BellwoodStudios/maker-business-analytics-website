import { Stat, StatTypes, StatTargets, Block, StatData, StatDataItem } from 'api/model';
import { fetchGraphQL, getVaults } from 'api';
import { arraySum, arrayAvg } from 'utils';

/**
 * Fetch time series on all the high-level bite stats. Not to be used directly, but instead as a common stat dependency.
 */
export class BiteTotalsStat extends Stat {

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
                price: arrayAvg(values.map(v => v.extraData.price)),
                debtCeiling: arraySum(values.map(v => v.extraData.debtCeiling))
            }
        };
    }

    async fetch (query) {
        const args = query.toGraphQLFilter();

        const result = await fetchGraphQL("{" + getVaults().map(v => {
            return `
                i${v.id}: timeBiteTotals(ilkIdentifier:"${v.identifier}", ${args}) {
                    nodes {
                        bucketStart,
                        ink,
                        art,
                        tab
                    }
                }
            `;
        }).join(",") + "}");

        const data = Object.values(result.data).map(d => d.nodes.filter(n => n != null && query.filterByIlk(n)).map(n => {
            return new StatDataItem({
                block: new Block(n),
                value: 1,
                extraData: {
                    ...n,
                    group: n.ilkIdentifier
                }
            });
        })).flat();

        return new StatData({
            stat: this,
            data: data
        }).mergeByGroup();
    }

}

/**
 * Fetch time series on all the high-level flip stats. Not to be used directly, but instead as a common stat dependency.
 */
export class FlipBidTotalsStat extends Stat {

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
                price: arrayAvg(values.map(v => v.extraData.price)),
                debtCeiling: arraySum(values.map(v => v.extraData.debtCeiling))
            }
        };
    }

    async fetch (query) {
        const args = query.toGraphQLFilter();

        const result = await fetchGraphQL("{" + getVaults().map(v => {
            return `
                i${v.id}: timeFlipBidTotals(ilkIdentifier:"${v.identifier}", ${args}) {
                    nodes {
                        bucketStart,
                        lot,
                        bidAmount
                    }
                }
            `;
        }).join(",") + "}");

        const data = Object.values(result.data).map(d => d.nodes.filter(n => n != null && query.filterByIlk(n)).map(n => {
            return new StatDataItem({
                block: new Block(n),
                value: 1,
                extraData: {
                    ...n,
                    group: n.ilkIdentifier
                }
            });
        })).flat();

        return new StatData({
            stat: this,
            data: data
        }).mergeByGroup();
    }

}