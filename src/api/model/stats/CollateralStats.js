import { Stat, StatTypes, StatTargets, StatFormats, StatGroups, StatCategories, StatDataItem, Block, StatData } from 'api/model';
import IlkSnapshotStat from './base/IlkSnapshotStat';
import { fetchGraphQL } from 'api';
import { fromWad } from 'utils/MathUtils';

export class CollateralPriceStat extends Stat {

    constructor () {
        super({
            name: "Collateral Price",
            color: "#7E57C2",
            category: StatCategories.COLLATERAL,
            type: StatTypes.VALUE,
            format: StatFormats.DOLLARS,
            targets: StatTargets.COLLATERAL | StatTargets.VAULT,
            group: StatGroups.PRICE,
            stats: [
                new IlkSnapshotStat()
            ]
        });
    }

    combineStats (bucket, [snapshot]) {
        return snapshot.extraData.price;
    }

}

export class CollateralLockedStat extends Stat {

    constructor () {
        super({
            name: "Collateral Locked",
            color: "#89A74D",
            category: StatCategories.COLLATERAL,
            type: StatTypes.VALUE,
            format: StatFormats.NUMBER,
            targets: StatTargets.VAULT,
            group: StatGroups.SUPPLY_COLLATERAL,
        });
    }

    async fetch (query) {
        // FIXME - totalInk is too slow. Need to wait for ink support on the ilk_snapshot table.
        const blocks = await query.getBucketedBlockHeaders();
        const result = await fetchGraphQL("{" + blocks.map((b, i) => {
            return `i${i}: totalInk(ilkIdentifier:"${query.vault.identifier}", blockHeight:"${b.number}")`;
        }).join(",") + "}");

        const data = result.data.ilkInkTime.nodes.filter(n => query.filterByIlk(n)).map(n => {
            return new StatDataItem({
                block: new Block(n),
                value: fromWad(n.ink),
                extraData: {
                    group: n.ilkId,
                    ink: n.ink
                }
            });
        });

        return new StatData({
            stat: this,
            data: data
        }).mergeByGroup();
    }

}