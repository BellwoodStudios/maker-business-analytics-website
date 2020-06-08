import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, StatGroups, StatCategories } from 'api/model';
import { fromRad } from 'utils/MathUtils';
import IlkSnapshotStat from './IlkSnapshotStat';

export default class DebtCeilingStat extends Stat {

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