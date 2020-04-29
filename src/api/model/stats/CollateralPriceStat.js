import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, Block, StatData, StatDataItem } from 'api/model';
import { fetchGraphQL } from 'api';
import { fromWad } from 'utils/MathUtils';

export default class CollateralPriceStat extends Stat {

    constructor () {
        super({
            name: "Collateral Price",
            color: "#7E57C2",
            type: StatTypes.VALUE,
            format: StatFormats.NUMBER,
            targets: StatTargets.COLLATERAL | StatTargets.VAULT,
            aggregation: StatAggregations.AVERAGE
        });
    }

    async fetch (query) {
        const result = await fetchGraphQL(`
            {
                spotPokeTime(${query.toGraphQLFilter()}) {
                    nodes {
                        date,
                        ilkId,
                        value,
                        blockNumber,
                        blockTimestamp
                    }
                }
            }
        `);

        // TODO - shouldn't be filtering on client for performance reasons
        const data = result.data.spotPokeTime.nodes.filter(n => query.filterByIlk(n)).map(n => {
            return new StatDataItem({
                block: new Block(n),
                value: fromWad(n.value)
            });
        });
        
        return new StatData({
            stat: this,
            data: data
        });
    }

}