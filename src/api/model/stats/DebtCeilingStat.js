import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, Block, StatData, StatDataItem } from 'api/model';
import { fetchGraphQL } from 'api';
import { fromRad } from 'utils/MathUtils';

export default class NewVaultStat extends Stat {

    constructor () {
        super({
            name: "Debt Ceiling",
            color: "#E040FB",
            type: StatTypes.VALUE,
            format: StatFormats.NUMBER,
            targets: StatTargets.ALL,
            aggregation: StatAggregations.SUM
        });
    }

    async fetch (query) {
        const result = await fetchGraphQL(`
            {
                allVatIlkLines {
                    nodes {
                        ilkId,
                        line
                        headerByHeaderId {
                            blockNumber,
                            blockTimestamp
                        }
                    }
                }
            }
        `);

        // TODO - shouldn't be filtering on client for performance reasons
        const data = result.data.allVatIlkLines.nodes.filter(n => query.filterByIlk(n)).map(n => {
            return new StatDataItem({
                block: new Block(n.headerByHeaderId),
                value: fromRad(n.line),
                extraData: {
                    group: n.ilkId,
                    line: n.line
                }
            });
        });

        return new StatData({
            stat: this,
            data: data
        }).mergeByGroup();
    }

}