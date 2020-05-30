import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, Block, StatData, StatDataItem, StatGroups, StatCategories } from 'api/model';
import { fetchGraphQL } from 'api';
import { fromRad } from 'utils/MathUtils';

export default class SystemSurplusStat extends Stat {

    static VOW_ADDRESS = '0xA950524441892A31ebddF91d3cEEFa04Bf454466';

    constructor () {
        super({
            name: "System Surplus",
            color: "#ABEB63",
            category: StatCategories.SYSTEM,
            type: StatTypes.VALUE,
            format: StatFormats.NUMBER,
            targets: StatTargets.GLOBAL,
            aggregation: StatAggregations.SUM,
            group: StatGroups.SYSTEM_DAI
        });
    }

    async fetch (query) {
        const result = await fetchGraphQL(`
            {
                allVatDais(condition:{ guy:"${SystemSurplusStat.VOW_ADDRESS}" }) {
                    nodes {
                        dai,
                        headerByHeaderId {
                            blockNumber,
                            blockTimestamp
                        }
                    }
                }
            }
        `);

        // TODO - shouldn't be filtering on client for performance reasons
        const data = result.data.allVatDais.nodes.map(n => {
            return new StatDataItem({
                block: new Block(n.headerByHeaderId),
                value: fromRad(n.dai)
            });
        });

        return new StatData({
            stat: this,
            data: data
        });
    }

}