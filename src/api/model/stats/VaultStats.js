import { Stat, StatTypes, StatTargets, StatFormats, StatGroups, StatCategories } from 'api/model';
import FrobStat from './base/FrobStat';

export class LocksStat extends Stat {

    constructor () {
        super({
            name: "Locks",
            color: "#00E676",
            category: StatCategories.VAULT,
            type: StatTypes.EVENT,
            format: StatFormats.NUMBER,
            targets: StatTargets.COLLATERAL | StatTargets.VAULT,
            group: StatGroups.SUPPLY_COLLATERAL,
            stats: [
                new FrobStat()
            ]
        });
    }

    combineStats (bucket, [frobs]) {
        return frobs.extraData.lock;
    }

}

export class FreesStat extends Stat {

    constructor () {
        super({
            name: "Frees",
            color: "#FFA143",
            category: StatCategories.VAULT,
            type: StatTypes.EVENT,
            format: StatFormats.NUMBER,
            targets: StatTargets.COLLATERAL | StatTargets.VAULT,
            group: StatGroups.SUPPLY_COLLATERAL,
            stats: [
                new FrobStat()
            ]
        });
    }

    combineStats (bucket, [frobs]) {
        return frobs.extraData.free;
    }

}

export class DrawsStat extends Stat {

    constructor () {
        super({
            name: "Draws",
            color: "#4AC9F1",
            category: StatCategories.VAULT,
            type: StatTypes.EVENT,
            format: StatFormats.DAI,
            targets: StatTargets.ALL,
            group: StatGroups.SUPPLY_DAI,
            stats: [
                new FrobStat()
            ]
        });
    }

    combineStats (bucket, [frobs]) {
        return frobs.extraData.draw;
    }

}

export class WipesStat extends Stat {

    constructor () {
        super({
            name: "Wipes",
            color: "#567FEE",
            category: StatCategories.VAULT,
            type: StatTypes.EVENT,
            format: StatFormats.DAI,
            targets: StatTargets.ALL,
            group: StatGroups.SUPPLY_DAI,
            stats: [
                new FrobStat()
            ]
        });
    }

    combineStats (bucket, [frobs]) {
        return frobs.extraData.wipe;
    }

}