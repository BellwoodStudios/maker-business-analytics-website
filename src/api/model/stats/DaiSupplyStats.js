import { Stat, StatTypes, StatTargets, StatFormats, StatGroups, StatCategories } from 'api/model';
import IlkSnapshotStat from './base/IlkSnapshotStat';
import { PotPieStat, PotChiStat } from './base/PotStats';

export class DaiSupplyStat extends Stat {

    constructor () {
        super({
            name: "Dai Supply",
            color: "#448AFF",
            category: StatCategories.SUPPLY,
            type: StatTypes.VALUE,
            format: StatFormats.DAI,
            targets: StatTargets.ALL,
            group: StatGroups.SUPPLY_DAI,
            stats: [
                new IlkSnapshotStat()
            ]
        });
    }

    combineStats (bucket, [snapshot]) {
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
            format: StatFormats.DAI,
            targets: StatTargets.ALL,
            group: StatGroups.SUPPLY_DAI,
            stats: [
                new IlkSnapshotStat()
            ]
        });
    }

    combineStats (bucket, [snapshot]) {
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
            format: StatFormats.DAI,
            targets: StatTargets.GLOBAL,
            group: StatGroups.SUPPLY_DAI,
            stats: [
                new PotPieStat(),
                new PotChiStat()
            ]
        });
    }

    combineStats (bucket, [pie, chi]) {
        if (pie == null) {
            return null;
        } else if (chi == null) {
            return pie.value;
        } else {
            return pie.value * chi.value;
        }
    }

}