import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, StatGroups, StatCategories } from 'api/model';
import { ilkSpotToPrice } from 'utils/MathUtils';
import IlkSnapshotStat from './IlkSnapshotStat';

export default class CollateralPriceStat extends Stat {

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
        return snapshot.extraData.spot != null && snapshot.extraData.mat != null ? ilkSpotToPrice(snapshot.extraData.spot, snapshot.extraData.mat) : null;
    }

}