import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, Block, StatData, StatDataItem } from 'api/model';
import { fetchGraphQL } from 'api';
import { fromWad, fromRay } from 'utils/MathUtils';

export default class SavingsDaiStat extends Stat {

    constructor () {
        super({
            name: "Savings Dai",
            color: "#5C6BC0",
            type: StatTypes.VALUE,
            format: StatFormats.NUMBER,
            targets: StatTargets.GLOBAL,
            aggregation: StatAggregations.SUM,
            group: "dai",
            stats: [
                new PotPieStat(),
                new PotChiStat()
            ]
        });
    }

    combine ([pie, chi]) {
        if (pie == null) {
            return null;
        } else if (chi == null) {
            return pie.value;
        } else {
            return pie.value * chi.value;
        }
    }

}

class PotPieStat extends Stat {

    constructor () {
        super({
            type: StatTypes.VALUE
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

class PotChiStat extends Stat {

    constructor () {
        super({
            type: StatTypes.VALUE
        });
    }

    async fetch (query) {
        const result = await fetchGraphQL(`
            {
                potChiTime(${query.toGraphQLFilter()}) {
                    nodes {
                        date,
                        chi,
                        blockNumber,
                        blockTimestamp
                    }
                }
            }
        `);

        // TODO - shouldn't be filtering on client for performance reasons
        const data = result.data.potChiTime.nodes.map(n => {
            return new StatDataItem({
                block: new Block(n),
                value: fromRay(n.pie)
            });
        });
        
        return new StatData({
            stat: this,
            data: data
        });
    }

}