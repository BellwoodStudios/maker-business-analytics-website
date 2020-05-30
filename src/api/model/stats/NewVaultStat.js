import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, Block, StatData, StatDataItem, StatGroups } from 'api/model';
import { fetchGraphQL } from 'api';

export default class NewVaultStat extends Stat {

    constructor () {
        super({
            name: "Vaults Created",
            color: "#FF7043",
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
                allNewCdps {
                    nodes {
                        headerByHeaderId {
                            blockNumber,
                            blockTimestamp
                        }
                    }
                }
            }
        `);

        // TODO - shouldn't be filtering on client for performance reasons
        const data = result.data.allNewCdps.nodes.map(n => {
            return new StatDataItem({
                block: new Block(n.headerByHeaderId),
                value: 1
            });
        });

        return new StatData({
            stat: this,
            data: data
        });
    }

}