import { Stat, StatTypes, StatTargets, StatFormats, StatCategories } from 'api/model';
import { feeToAPY } from 'utils/MathUtils';
import IlkSnapshotStat from './IlkSnapshotStat';

export default class StabilityFeeStat extends Stat {

    constructor () {
        super({
            name: "Stability Fee",
            color: "#1AAB9B",
            category: StatCategories.FEES,
            type: StatTypes.VALUE,
            format: StatFormats.PERCENT,
            targets: StatTargets.VAULT,
            stats: [
                new IlkSnapshotStat()
            ]
        });
    }

    combine ([snapshot]) {
        return snapshot.extraData.duty != null ? feeToAPY(snapshot.extraData.duty) : null;
    }

}
