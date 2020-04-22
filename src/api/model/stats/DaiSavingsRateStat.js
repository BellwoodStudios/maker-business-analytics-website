import { Stat, StatTypes, StatTargets, StatAggregations, Block, StatData, StatDataItem } from 'api/model';
import { fetchGraphQL } from 'api';
import { feeToAPY } from 'utils/MathUtils';

export default class DaiSavingsRateStat extends Stat {

    constructor () {
        super({
            name: "Dai Savings Rate",
            color: "#26C6DA",
            type: StatTypes.PERCENT,
            targets: StatTargets.ALL,
            aggregation: StatAggregations.REPLACE
        });
    }

    async fetch (query) {
        const result = await fetchGraphQL(`
            {
                allPotFileDsrs {
                    nodes {
                        id,
                        headerId,
                        what,
                        data,
                        headerByHeaderId {
                            blockNumber,
                            blockTimestamp
                        }
                    }
                }
            }
        `);

        // TODO - shouldn't be filtering on client for performance reasons
        const data = result.data.allPotFileDsrs.nodes.filter(n => n.what === "dsr").map(n => {
            return new StatDataItem({
                block: new Block(n.headerByHeaderId),
                value: feeToAPY(n.data),
                extraData: {
                    compoundingFee: n.data,
                    fee: feeToAPY(n.data)
                }
            });
        });

        return new StatData({
            stat: this,
            data: data
        });
    }

}