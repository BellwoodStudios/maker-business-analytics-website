import { fromWad, fromRay } from 'utils/MathUtils';
import { Stat, StatTypes } from 'api/model';

export class PotPieStat extends Stat {

    constructor () {
        super({
            type: StatTypes.VALUE
        });
    }

    async fetch (query) {
        const statData = await this.getStorageTableValues(query, "allPotPies", "pie", v => fromWad(v));

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
        const statData = await this.getStorageTableValues(query, "allPotChis", "chi", v => fromRay(v));

        // Add in the last value for DSR Cost
        let lastValue = null;
        for (const stat of statData.data) {
            stat.extraData.lastValue = lastValue;

            lastValue = stat.extraData.raw;
        }

        return statData;
    }

}