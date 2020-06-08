import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, StatGroups, StatCategories } from 'api/model';
import { parseDaiSupply } from 'utils/MathUtils';
import IlkSnapshotStat from './IlkSnapshotStat';

export default class DaiSupplyStat extends Stat {

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
        return snapshot.extraData.art != null ? parseDaiSupply(snapshot.extraData.art, snapshot.extraData.rate) : null;
    }

}