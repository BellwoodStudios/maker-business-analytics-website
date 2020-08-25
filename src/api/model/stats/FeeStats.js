import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, Block, StatData, StatDataItem, StatCategories, StatGroups } from 'api/model';
import { fetchGraphQL } from 'api';
import { feeToAPY, parseFeesCollected } from 'utils/MathUtils';
import IlkSnapshotStat from './base/IlkSnapshotStat';
import { PotPieStat, PotChiStat } from './base/PotStats';

export class StabilityFeeStat extends Stat {

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
        return feeToAPY(snapshot.extraData.duty);
    }

}

export class StabilityFeeRevenueStat extends Stat {

    constructor () {
        super({
            name: "Stability Fee Revenue",
            color: "#ABEB63",
            category: StatCategories.FEES,
            type: StatTypes.VALUE_OF_EVENT,
            format: StatFormats.DAI,
            targets: StatTargets.ALL,
            aggregation: StatAggregations.SUM,
            group: StatGroups.SYSTEM_DAI,
            stats: [
                new IlkSnapshotStat()
            ]
        });
    }

    combine ([snapshot]) {
        return snapshot.extraData.feesCollected;
    }

}

export class DaiSavingsRateStat extends Stat {

    constructor () {
        super({
            name: "Dai Savings Rate",
            color: "#26C6DA",
            category: StatCategories.FEES,
            type: StatTypes.VALUE,
            format: StatFormats.PERCENT,
            targets: StatTargets.GLOBAL,
            aggregation: StatAggregations.AVERAGE
        });
    }

    async fetch (query) {
        const result = await fetchGraphQL(`
            {
                allPotFileDsrs {
                    nodes {
                        id,
                        headerId,
                        what,
                        data,
                        headerByHeaderId {
                            blockNumber,
                            blockTimestamp
                        }
                    }
                }
            }
        `);

        // TODO - shouldn't be filtering on client for performance reasons
        const data = result.data.allPotFileDsrs.nodes.filter(n => n.what === "dsr").map(n => {
            return new StatDataItem({
                block: new Block(n.headerByHeaderId),
                value: feeToAPY(n.data),
                extraData: {
                    compoundingFee: n.data,
                    fee: feeToAPY(n.data)
                }
            });
        });
        
        return new StatData({
            stat: this,
            data: data
        });
    }

}

export class SavingsDaiCostStat extends Stat {

    constructor () {
        super({
            name: "Savings Dai Cost",
            color: "#FF4081",
            category: StatCategories.FEES,
            type: StatTypes.VALUE_OF_EVENT,
            format: StatFormats.DAI,
            targets: StatTargets.GLOBAL,
            aggregation: StatAggregations.SUM,
            group: StatGroups.SYSTEM_DAI,
            stats: [
                new PotPieStat(),
                new PotChiStat()
            ]
        });
    }

    combine ([pie, chi]) {
        if (pie != null && chi != null) {
            return parseFeesCollected(pie.extraData.lastValue, pie.extraData.raw, chi.extraData.lastValue, chi.extraData.raw);
        } else {
            return 0;
        }
    }

}

export class FeeProfitStat extends Stat {

    constructor () {
        super({
            name: "Fee Profit",
            color: "#83D17E",
            category: StatCategories.FEES,
            type: StatTypes.VALUE_OF_EVENT,
            format: StatFormats.DAI,
            targets: StatTargets.ALL,
            aggregation: StatAggregations.SUM,
            group: StatGroups.SYSTEM_DAI,
            stats: [
                new StabilityFeeRevenueStat(),
                new SavingsDaiCostStat()
            ]
        });
    }

    combine ([stabilityFees, dsrCost]) {
        let value = 0;
        if (stabilityFees != null) value += stabilityFees.value;
        if (dsrCost != null) value -= dsrCost.value;
        return value;
    }

}