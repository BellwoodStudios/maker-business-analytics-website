import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, StatGroups, StatCategories } from 'api/model';
import { fromRad } from 'utils/MathUtils';

export class SurplusBufferStat extends Stat {

    static VOW_ADDRESS = '0xA950524441892A31ebddF91d3cEEFa04Bf454466';

    constructor () {
        super({
            name: "Surplus Buffer",
            color: "#ABEB63",
            category: StatCategories.SYSTEM,
            type: StatTypes.VALUE,
            format: StatFormats.NUMBER,
            targets: StatTargets.GLOBAL,
            aggregation: StatAggregations.SUM,
            group: StatGroups.SYSTEM_DAI,
            stats: [
                new VatDaiStat(),
                new VatVicesStat()
            ]
        });
    }

    combine ([dai, vice]) {
        if (dai != null && vice != null) {
            return dai.value - vice.value;
        } else {
            return 0;
        }
    }

}

class VatDaiStat extends Stat {

    static VOW_ADDRESS = '0xA950524441892A31ebddF91d3cEEFa04Bf454466';

    constructor () {
        super({
            type: StatTypes.VALUE
        });
    }

    async fetch (query) {
        return await this.getStorageTableValues(query, "allVatDais", "dai", v => fromRad(v), {
            queryExtra: `condition:{ guy:"${SurplusBufferStat.VOW_ADDRESS}" }`
        });
    }

}

class VatVicesStat extends Stat {

    constructor () {
        super({
            type: StatTypes.VALUE
        });
    }

    async fetch (query) {
        return await this.getStorageTableValues(query, "allVatVices", "vice", v => fromRad(v));
    }

}