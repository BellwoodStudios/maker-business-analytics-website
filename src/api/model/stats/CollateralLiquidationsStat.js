import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, Block, StatData, StatDataItem, StatGroups } from 'api/model';
import { fetchGraphQL } from 'api';

/**
 * The number of liquidations that have occurred. Note: This stores a bunch of extra data to be used in other auction stats.
 */
export default class CollateralLiquidationsStat extends Stat {

    constructor () {
        super({
            name: "Collateral Liquidations",
            color: "#FF5252",
            type: StatTypes.EVENT,
            format: StatFormats.NUMBER,
            targets: StatTargets.ALL,
            aggregation: StatAggregations.SUM,
            group: StatGroups.COUNT
        });
    }

    async fetch (query) {
        const result = await fetchGraphQL(`
            {
                bitesTime(${query.toGraphQLFilter()}) {
                    nodes {
                        date,
                        ilkId,
                        num,
                        ink,
                        art,
                        tab,
                        blockNumber,
                        blockTimestamp
                    }
                }
            }
        `);

        // TODO - shouldn't be filtering on client for performance reasons
        const data = result.data.bitesTime.nodes.filter(n => query.filterByIlk(n)).map(n => {
            return new StatDataItem({
                block: new Block(n),
                value: parseInt(n.num),
                extraData: {
                    group: n.ilkId,
                    ink: n.ink,
                    art: n.art,
                    tab: n.tab
                }
            });
        });

        return new StatData({
            stat: this,
            data: data
        }).mergeByGroup();
    }

}