import { fetchGraphQL } from 'api';
import { fromWad, fromRay } from 'utils/MathUtils';
import { Stat, StatTypes, StatDataItem, Block, StatData } from 'api/model';

export class PotPieStat extends Stat {

    constructor () {
        super({
            type: StatTypes.VALUE
        });
    }

    async fetch (query) {
        const blocks = await query.getBucketedBlockHeaders();
        const result = await fetchGraphQL("{" + blocks.map((b, i) => {
            return `i${i}: allPotPies(filter:{ headerId:{ lessThanOrEqualTo:${b.id} } }, orderBy:HEADER_ID_DESC, first:1) {
                nodes {
                  pie,
                  headerByHeaderId {
                    blockNumber,
                    blockTimestamp
                  }
                }
              }`;
        }).join(",") + "}");

        const data = Object.values(result.data).flatMap(d => d.nodes.map(n => {
            return new StatDataItem({
                block: new Block(n.headerByHeaderId),
                value: fromWad(n.pie),
                extraData: {
                    raw: n.pie
                }
            });
        }));
        
        const statData = new StatData({
            stat: this,
            data: data
        });

        // Add in the last value for DSR Cost
        let lastValue = null;
        for (const stat of statData.data) {
            stat.extraData.lastValue = lastValue;

            lastValue = stat.extraData.raw;
        }

        return statData;
    }

}

export class PotChiStat extends Stat {

    constructor () {
        super({
            type: StatTypes.VALUE
        });
    }

    async fetch (query) {
        const blocks = await query.getBucketedBlockHeaders();
        const result = await fetchGraphQL("{" + blocks.map((b, i) => {
            return `i${i}: allPotChis(filter:{ headerId:{ lessThanOrEqualTo:${b.id} } }, orderBy:HEADER_ID_DESC, first:1) {
                nodes {
                  chi,
                  headerByHeaderId {
                    blockNumber,
                    blockTimestamp
                  }
                }
              }`;
        }).join(",") + "}");

        const data = Object.values(result.data).flatMap(d => d.nodes.map(n => {
            return new StatDataItem({
                block: new Block(n.headerByHeaderId),
                value: fromRay(n.chi),
                extraData: {
                    raw: n.chi
                }
            });
        }));
        
        const statData = new StatData({
            stat: this,
            data: data
        });

        // Add in the last value for DSR Cost
        let lastValue = null;
        for (const stat of statData.data) {
            stat.extraData.lastValue = lastValue;

            lastValue = stat.extraData.raw;
        }

        return statData;
    }

}