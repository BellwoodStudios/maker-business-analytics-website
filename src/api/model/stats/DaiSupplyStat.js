import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, Block, StatData, StatDataItem } from 'api/model';
import { fetchGraphQL } from 'api';
import { weiToDai } from 'utils/MathUtils';

export default class DaiSupplyStat extends Stat {

    constructor () {
        super({
            name: "Dai Supply",
            color: "#448AFF",
            type: StatTypes.VALUE,
            format: StatFormats.NUMBER,
            targets: StatTargets.ALL,
            aggregation: StatAggregations.SUM
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
        const data = result.data.allVatIlkArts.nodes.filter(n => query.filterByIlk(n)).map(n => {
            return new StatDataItem({
                block: new Block(n.headerByHeaderId),
                value: weiToDai(n.art),
                extraData: {
                    group: n.ilkId,
                    wei: n.art
                }
            });
        });

        return new StatData({
            stat: this,
            data: data
        }).mergeByGroup();
    }

}