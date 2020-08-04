import { Stat, StatTypes, StatTargets, Block, StatData, StatDataItem } from 'api/model';
import { fetchGraphQL, getVaults } from 'api';
import { arraySum } from 'utils';
import { fromRad, fromWad } from 'utils/MathUtils';

/**
 * Fetch time series on all the high-level bite stats. Not to be used directly, but instead as a common stat dependency.
 */
export class BiteTotalsStat extends Stat {

    constructor () {
        super({
            type: StatTypes.EVENT,
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
                ink: arraySum(values.map(v => v.extraData.ink)),
                art: arraySum(values.map(v => v.extraData.tab)),
                tab: arraySum(values.map(v => v.extraData.tab))
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

        // Attach ilk id to all nodes
        for (const idstr of Object.keys(result.data)) {
            const id = parseInt(idstr.substr(1));
            for (const node of result.data[idstr].nodes) {
                node.ilkId = id;
            }
        }

        const data = Object.values(result.data).map(d => d.nodes.filter(n => n != null && query.filterByIlk(n)).map(n => {
            return new StatDataItem({
                block: new Block(n),
                value: 1,
                extraData: {
                    group: n.ilkIdentifier,
                    ink: fromWad(n.ink),
                    art: fromRad(n.art),
                    tab: fromRad(n.tab)
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
            type: StatTypes.EVENT,
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
                lotStart: arraySum(values.map(v => v.extraData.lotStart)),
                lotEnd: arraySum(values.map(v => v.extraData.lotEnd)),
                bidAmountStart: arraySum(values.map(v => v.extraData.bidAmountStart)),
                bidAmountEnd: arraySum(values.map(v => v.extraData.bidAmountEnd))
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
                        lotStart,
                        lotEnd,
                        bidAmountStart,
                        bidAmountEnd
                    }
                }
            `;
        }).join(",") + "}");

        // Attach ilk id to all nodes
        for (const idstr of Object.keys(result.data)) {
            const id = parseInt(idstr.substr(1));
            for (const node of result.data[idstr].nodes) {
                node.ilkId = id;
            }
        }

        const data = Object.values(result.data).map(d => d.nodes.filter(n => n != null && query.filterByIlk(n)).map(n => {
            return new StatDataItem({
                block: new Block(n),
                value: 1,
                extraData: {
                    group: n.ilkIdentifier,
                    lotStart: fromWad(n.lotStart),
                    lotEnd: fromWad(n.lotEnd),
                    bidAmountStart: fromRad(n.bidAmountStart),
                    bidAmountEnd: fromRad(n.bidAmountEnd),
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
 * Fetch time series on all the high-level flop stats. Not to be used directly, but instead as a common stat dependency.
 */
export class FlopBidTotalsStat extends Stat {

    constructor () {
        super({
            type: StatTypes.EVENT,
            targets: StatTargets.ALL
        });
    }

    async fetch (query) {
        const args = query.toGraphQLFilter();

        const result = await fetchGraphQL(`
            {
                timeFlopBidTotals(${args}) {
                    nodes {
                        bucketStart,
                        lotStart,
                        lotEnd,
                        bidAmountStart,
                        bidAmountEnd
                    }
                }
            }
        `);

        const data = result.data.timeFlopBidTotals.nodes.map(n => {
            return new StatDataItem({
                block: new Block(n),
                value: 1,
                extraData: {
                    lotStart: fromWad(n.lotStart),
                    lotEnd: fromWad(n.lotEnd),
                    bidAmountStart: fromRad(n.bidAmountStart),
                    bidAmountEnd: fromRad(n.bidAmountEnd),
                }
            });
        });

        return new StatData({
            stat: this,
            data: data
        });
    }

}

/**
 * Fetch time series on all the high-level flap stats. Not to be used directly, but instead as a common stat dependency.
 */
export class FlapBidTotalsStat extends Stat {

    constructor () {
        super({
            type: StatTypes.EVENT,
            targets: StatTargets.ALL
        });
    }

    async fetch (query) {
        const args = query.toGraphQLFilter();

        const result = await fetchGraphQL(`
            {
                timeFlapBidTotals(${args}) {
                    nodes {
                        bucketStart,
                        lotStart,
                        lotEnd,
                        bidAmountStart,
                        bidAmountEnd
                    }
                }
            }
        `);

        const data = result.data.timeFlapBidTotals.nodes.map(n => {
            return new StatDataItem({
                block: new Block(n),
                value: 1,
                extraData: {
                    lotStart: fromRad(n.lotStart),
                    lotEnd: fromRad(n.lotEnd),
                    bidAmountStart: fromWad(n.bidAmountStart),
                    bidAmountEnd: fromWad(n.bidAmountEnd),
                }
            });
        });

        return new StatData({
            stat: this,
            data: data
        });
    }

}