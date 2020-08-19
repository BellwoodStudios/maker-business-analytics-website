import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, StatGroups, StatCategories } from 'api/model';
import IlkSnapshotStat from './base/IlkSnapshotStat';

export class CollateralPriceStat extends Stat {

    constructor () {
        super({
            name: "Collateral Price",
            color: "#7E57C2",
            category: StatCategories.COLLATERAL,
            type: StatTypes.VALUE,
            format: StatFormats.DOLLARS,
            targets: StatTargets.COLLATERAL | StatTargets.VAULT,
            aggregation: StatAggregations.AVERAGE,
            group: StatGroups.PRICE,
            stats: [
                new IlkSnapshotStat()
            ]
        });
    }

    combine ([snapshot]) {
        return snapshot.extraData.price;
    }

}