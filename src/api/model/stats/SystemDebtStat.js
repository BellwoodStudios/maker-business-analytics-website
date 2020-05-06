import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, Block, StatData, StatDataItem } from 'api/model';
import { fetchGraphQL } from 'api';
import { fromRad } from 'utils/MathUtils';

export default class SystemDebtStat extends Stat {

    constructor () {
        super({
            name: "System Debt",
            color: "#FF4081",
            type: StatTypes.VALUE,
            format: StatFormats.NUMBER,
            targets: StatTargets.ALL,
            aggregation: StatAggregations.SUM,
            group: "sysdai"
        });
    }

    async fetch (query) {
        const result = await fetchGraphQL(`
            {
                allVatVices {
                    nodes {
                        vice,
                        headerByHeaderId {
                            blockNumber,
                            blockTimestamp
                        }
                    }
                }
            }
        `);

        // TODO - shouldn't be filtering on client for performance reasons
        const data = result.data.allVatVices.nodes.map(n => {
            return new StatDataItem({
                block: new Block(n.headerByHeaderId),
                value: fromRad(n.vice)
            });
        });

        return new StatData({
            stat: this,
            data: data
        });
    }

}