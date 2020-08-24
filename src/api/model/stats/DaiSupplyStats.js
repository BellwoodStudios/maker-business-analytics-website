import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, StatGroups, StatCategories, StatDataItem, Block, StatData } from 'api/model';
import IlkSnapshotStat from './base/IlkSnapshotStat';
import { fetchGraphQL } from 'api';
import { fromWad, fromRay } from 'utils/MathUtils';

export class DaiSupplyStat extends Stat {

    constructor () {
        super({
            name: "Dai Supply",
            color: "#448AFF",
            category: StatCategories.SUPPLY,
            type: StatTypes.VALUE,
            format: StatFormats.NUMBER,
            targets: StatTargets.ALL,
            aggregation: StatAggregations.SUM,
            group: StatGroups.SUPPLY_DAI,
            stats: [
                new IlkSnapshotStat()
            ]
        });
    }

    combine ([snapshot]) {
        return snapshot.extraData.dai;
    }

}

export class DebtCeilingStat extends Stat {

    constructor () {
        super({
            name: "Debt Ceiling",
            color: "#E040FB",
            category: StatCategories.SUPPLY,
            type: StatTypes.VALUE,
            format: StatFormats.NUMBER,
            targets: StatTargets.ALL,
            aggregation: StatAggregations.SUM,
            group: StatGroups.SUPPLY_DAI,
            stats: [
                new IlkSnapshotStat()
            ]
        });
    }

    combine ([snapshot]) {
        return snapshot.extraData.debtCeiling;
    }

}
export class SavingsDaiStat extends Stat {

    constructor () {
        super({
            name: "Savings Dai",
            color: "#5C6BC0",
            category: StatCategories.SUPPLY,
            type: StatTypes.VALUE,
            format: StatFormats.NUMBER,
            targets: StatTargets.GLOBAL,
            aggregation: StatAggregations.SUM,
            group: StatGroups.SUPPLY_DAI,
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

        // TODO - shouldn't be filtering on client for performance reasons
        const data = Object.values(result.data).flatMap(d => d.nodes.map(n => {
            return new StatDataItem({
                block: new Block(n.headerByHeaderId),
                value: fromWad(n.pie)
            });
        }));
        
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

        // TODO - shouldn't be filtering on client for performance reasons
        const data = Object.values(result.data).flatMap(d => d.nodes.map(n => {
            return new StatDataItem({
                block: new Block(n.headerByHeaderId),
                value: fromRay(n.chi)
            });
        }));
        
        return new StatData({
            stat: this,
            data: data
        });
    }

}