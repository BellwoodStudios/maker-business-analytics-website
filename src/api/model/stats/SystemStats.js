import { Stat, StatTypes, StatTargets, StatFormats, StatGroups, StatCategories } from 'api/model';
import { fromRad } from 'utils/MathUtils';
import { StabilityFeeRevenueStat, SavingsDaiCostStat } from './FeeStats';
import { CollateralDebtRecoveredStat, CollateralDebtOwedStat } from './CollateralAuctionStats';

export class SurplusBufferStat extends Stat {

    static VOW_ADDRESS = '0xA950524441892A31ebddF91d3cEEFa04Bf454466';

    constructor () {
        super({
            name: "Surplus Buffer",
            color: "#ABEB63",
            category: StatCategories.SYSTEM,
            type: StatTypes.VALUE,
            format: StatFormats.DAI,
            targets: StatTargets.GLOBAL,
            group: StatGroups.SYSTEM_DAI,
            stats: [
                new VatDaiStat(),
                new VatVicesStat()
            ]
        });
    }

    combineStats (bucket, [dai, vice]) {
        if (dai != null && vice != null) {
            return dai.value - vice.value;
        } else {
            return 0;
        }
    }

}

class VatDaiStat extends Stat {

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

export class SystemRevenueStat extends Stat {

    constructor () {
        super({
            name: "Total Revenue",
            color: "#ABEB63",
            category: StatCategories.SYSTEM,
            type: StatTypes.EVENT,
            format: StatFormats.DAI,
            targets: StatTargets.GLOBAL,
            group: StatGroups.SYSTEM_DAI,
            stats: [
                new StabilityFeeRevenueStat(),
                new CollateralDebtRecoveredStat()
            ]
        });
    }

    combineStats (bucket, [fees, flips]) {
        let value = 0;
        if (fees != null) value += fees.value;
        if (flips != null) value += flips.value;
        return value;
    }

}

export class SystemCostStat extends Stat {

    constructor () {
        super({
            name: "Total Cost",
            color: "#FF4081",
            category: StatCategories.SYSTEM,
            type: StatTypes.EVENT,
            format: StatFormats.DAI,
            targets: StatTargets.GLOBAL,
            group: StatGroups.SYSTEM_DAI,
            stats: [
                new SavingsDaiCostStat(),
                new CollateralDebtOwedStat()
            ]
        });
    }

    combineStats (bucket, [fees, flips]) {
        let value = 0;
        if (fees != null) value += fees.value;
        if (flips != null) value += flips.value;
        return value;
    }

}

export class SystemProfitStat extends Stat {

    constructor () {
        super({
            name: "Total Profit",
            color: "#83D17E",
            category: StatCategories.SYSTEM,
            type: StatTypes.EVENT,
            format: StatFormats.DAI,
            targets: StatTargets.GLOBAL,
            group: StatGroups.SYSTEM_DAI,
            stats: [
                new SystemRevenueStat(),
                new SystemCostStat()
            ]
        });
    }

    combineStats (bucket, [revenue, cost]) {
        return revenue.value - cost.value;
    }

}