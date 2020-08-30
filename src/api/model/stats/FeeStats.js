import { Stat, StatTypes, StatTargets, StatFormats, Bucket, StatData, StatDataItem, StatCategories, StatGroups } from 'api/model';
import { fetchGraphQL } from 'api';
import { feeToAPY, parseFeesCollected } from 'utils/MathUtils';
import IlkSnapshotStat from './base/IlkSnapshotStat';
import { PotPieStat, PotChiStat } from './base/PotStats';
import moment from 'moment';

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

    combineStats (bucket, [snapshot]) {
        return feeToAPY(snapshot.extraData.duty);
    }

}

export class StabilityFeeRevenueStat extends Stat {

    constructor () {
        super({
            name: "Stability Fee Revenue",
            color: "#ABEB63",
            category: StatCategories.FEES,
            type: StatTypes.EVENT,
            format: StatFormats.DAI,
            targets: StatTargets.ALL,
            group: StatGroups.SYSTEM_DAI,
            stats: [
                new IlkSnapshotStat()
            ]
        });
    }

    combineStats (bucket, [snapshot]) {
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
            targets: StatTargets.GLOBAL
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
                bucket: new Bucket({
                    bucketStart: moment.unix(n.headerByHeaderId.blockTimestamp),
                    bucketEnd: moment.unix(n.headerByHeaderId.blockTimestamp)
                }),
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
            type: StatTypes.EVENT,
            format: StatFormats.DAI,
            targets: StatTargets.GLOBAL,
            group: StatGroups.SYSTEM_DAI,
            stats: [
                new PotPieStat(),
                new PotChiStat()
            ]
        });
    }

    combineStats (bucket, [pie, chi]) {
        if (pie.extraData.raw != null && chi.extraData.raw != null) {
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
            type: StatTypes.EVENT,
            format: StatFormats.DAI,
            targets: StatTargets.ALL,
            group: StatGroups.SYSTEM_DAI,
            stats: [
                new StabilityFeeRevenueStat(),
                new SavingsDaiCostStat()
            ]
        });
    }

    combineStats (bucket, [stabilityFees, dsrCost]) {
        let value = 0;
        if (stabilityFees != null) value += stabilityFees.value;
        if (dsrCost != null) value -= dsrCost.value;
        return value;
    }

}