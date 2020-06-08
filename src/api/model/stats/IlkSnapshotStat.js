import { Stat, StatTypes, StatTargets, Block, StatData, StatDataItem } from 'api/model';
import { fetchGraphQL, getVaults } from 'api';

/**
 * Fetch time series on all the high-level ilk stats.
 */
export default class IlkSnapshotStat extends Stat {

    constructor () {
        super({
            type: StatTypes.VALUE,
            targets: StatTargets.ALL
        });
    }

    async fetch (query) {
        const args = query.toGraphQLFilter();

        const result = await fetchGraphQL("{" + getVaults().map(v => {
            return `
                i${v.id}: timeIlkSnapshots(ilkIdentifier:"${v.identifier}", ${args}) {
                    nodes {
                        ilkIdentifier,
                        blockNumber,
                        updated,
                        rate,
                        art,
                        spot,
                        line,
                        rho,
                        duty,
                        mat
                    }
                }
            `;
        }).join(",") + "}");

        const data = Object.values(result.data).map(d => d.nodes.filter(n => n != null && query.filterByIlk(n)).map(n => {
            return new StatDataItem({
                block: new Block(n),
                value: 1,
                extraData: {
                    ...n,
                    group: n.ilkIdentifier
                }
            });
        })).flat();

        return new StatData({
            stat: this,
            data: data
        }).mergeByGroup();
    }

}