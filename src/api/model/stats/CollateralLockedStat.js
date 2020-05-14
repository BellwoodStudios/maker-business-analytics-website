import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, Block, StatData, StatDataItem } from 'api/model';
import { fetchGraphQL } from 'api';
import { fromWad } from 'utils/MathUtils';

export default class CollateralLockedStat extends Stat {

    constructor () {
        super({
            name: "Collateral Locked",
            color: "#89A74D",
            type: StatTypes.VALUE,
            format: StatFormats.NUMBER,
            targets: StatTargets.COLLATERAL | StatTargets.VAULT,
            aggregation: StatAggregations.SUM,
            group: "collateral"
        });
    }

    async fetch (query) {
        const result = await fetchGraphQL(`
            {
                ilkInkTime(${query.toGraphQLFilter()}) {
                    nodes {
                        date,
                        ilkId,
                        ink,
                        blockNumber,
                        blockTimestamp
                    }
                }
            }
        `);

        // TODO - shouldn't be filtering on client for performance reasons
        const data = result.data.ilkInkTime.nodes.filter(n => query.filterByIlk(n)).map(n => {
            return new StatDataItem({
                block: new Block(n),
                value: fromWad(n.ink),
                extraData: {
                    group: n.ilkId,
                    ink: n.ink
                }
            });
        });

        return new StatData({
            stat: this,
            data: data
        }).mergeByGroup();
    }

}