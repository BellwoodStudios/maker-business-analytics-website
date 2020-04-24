import { Stat, StatTypes, StatTargets, StatAggregations, Block, StatData, StatDataItem } from 'api/model';
import { fetchGraphQL } from 'api';
import { weiToDai } from 'utils/MathUtils';

export default class DaiSupplyStat extends Stat {

    constructor () {
        super({
            name: "Dai Supply",
            color: "#448AFF",
            type: StatTypes.NUMBER,
            targets: StatTargets.VAULT,
            aggregation: StatAggregations.REPLACE
        });
    }

    async fetch (query) {
        const result = await fetchGraphQL(`
            {
                allVatIlkArts {
                    nodes {
                        headerId,
                        ilkId,
                        art,
                        headerByHeaderId {
                            blockNumber,
                            blockTimestamp
                        }
                    }
                }
            }
        `);

        // TODO - shouldn't be filtering on client for performance reasons
        const data = result.data.allVatIlkArts.nodes.filter(n => n.ilkId === query.vault.id).map(n => {
            return new StatDataItem({
                block: new Block(n.headerByHeaderId),
                value: weiToDai(n.art)
            });
        });

        return new StatData({
            stat: this,
            data: data
        });
    }

}