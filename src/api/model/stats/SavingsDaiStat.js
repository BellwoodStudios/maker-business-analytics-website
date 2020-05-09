import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, Block, StatData, StatDataItem } from 'api/model';
import { fetchGraphQL } from 'api';
import { fromWad } from 'utils/MathUtils';

export default class SavingsDai extends Stat {

    constructor () {
        super({
            name: "Savings Dai",
            color: "#5C6BC0",
            type: StatTypes.VALUE,
            format: StatFormats.NUMBER,
            targets: StatTargets.GLOBAL,
            aggregation: StatAggregations.SUM,
            group: "dai"
        });
    }

    async fetch (query) {
        const result = await fetchGraphQL(`
            {
                potPieTime(${query.toGraphQLFilter()}) {
                    nodes {
                        date,
                        pie,
                        blockNumber,
                        blockTimestamp
                    }
                }
            }
        `);

        // TODO - shouldn't be filtering on client for performance reasons
        const data = result.data.potPieTime.nodes.map(n => {
            return new StatDataItem({
                block: new Block(n),
                value: fromWad(n.pie)
            });
        });
        
        return new StatData({
            stat: this,
            data: data
        });
    }

}