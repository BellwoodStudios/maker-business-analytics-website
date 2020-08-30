import { Stat, StatTypes, StatTargets, StatFormats, StatGroups, StatCategories } from 'api/model';
import { FlipBidTotalsStat, BiteTotalsStat } from './base/AuctionTotalsStats';
import IlkSnapshotStat from './base/IlkSnapshotStat';

export class CollateralDebtOwedStat extends Stat {

    constructor () {
        super({
            name: "Debt Owed",
            color: "#FF4081",
            category: StatCategories.COLLATERAL_AUCTION,
            type: StatTypes.EVENT,
            format: StatFormats.DAI,
            targets: StatTargets.ALL,
            group: StatGroups.AUCTION_DAI,
            stats: [
                new BiteTotalsStat()
            ]
        });
    }

    combineStats (bucket, [totals]) {
        return totals.extraData.tab ?? 0;
    }

}

export class CollateralDebtRecoveredStat extends Stat {

    constructor () {
        super({
            name: "Debt Recovered",
            color: "#ABEB63",
            category: StatCategories.COLLATERAL_AUCTION,
            type: StatTypes.EVENT,
            format: StatFormats.DAI,
            targets: StatTargets.ALL,
            group: StatGroups.AUCTION_DAI,
            stats: [
                new FlipBidTotalsStat()
            ]
        });
    }

    combineStats (bucket, [totals]) {
        return totals.extraData.bidAmountEnd ?? 0;
    }

}

export class CollateralSurplusStat extends Stat {

    constructor () {
        super({
            name: "Profit",
            color: "#83D17E",
            category: StatCategories.COLLATERAL_AUCTION,
            type: StatTypes.EVENT,
            format: StatFormats.DAI,
            targets: StatTargets.ALL,
            group: StatGroups.SYSTEM_DAI,
            stats: [
                new BiteTotalsStat(),
                new FlipBidTotalsStat()
            ]
        });
    }

    combineStats (bucket, [bites, flips]) {
        return (flips.extraData.bidAmountEnd != null ? flips.extraData.bidAmountEnd : 0) - (bites.extraData.tab != null ? bites.extraData.tab : 0);
    }

}

export class AuctionedCollateralStat extends Stat {

    constructor () {
        super({
            name: "Auctioned Collateral",
            color: "#B584FF",
            category: StatCategories.COLLATERAL_AUCTION,
            type: StatTypes.EVENT,
            format: StatFormats.NUMBER,
            targets: StatTargets.COLLATERAL | StatTargets.VAULT,
            group: StatGroups.AUCTION_COLLATERAL,
            stats: [
                new BiteTotalsStat()
            ]
        });
    }

    combineStats (bucket, [totals]) {
        return totals.extraData.ink ?? 0;
    }

}

export class AuctionedCollateralUSDStat extends Stat {

    constructor () {
        super({
            name: "Auctioned Collateral USD",
            color: "#F4B731",
            category: StatCategories.COLLATERAL_AUCTION,
            type: StatTypes.EVENT,
            format: StatFormats.DOLLARS,
            targets: StatTargets.COLLATERAL | StatTargets.VAULT,
            group: StatGroups.AUCTION_DAI,
            stats: [
                new BiteTotalsStat(),
                new IlkSnapshotStat()
            ]
        });
    }

    combineStats (bucket, [bites, ilkSnapshot]) {
        return bites.extraData.ink != null && ilkSnapshot.extraData.price ? bites.extraData.ink * ilkSnapshot.extraData.price : 0;
    }

}

export class LiquidationsCountStat extends Stat {

    constructor () {
        super({
            name: "Liquidations Count",
            color: "#3FDFC9",
            category: StatCategories.COLLATERAL_AUCTION,
            type: StatTypes.EVENT,
            format: StatFormats.NUMBER,
            targets: StatTargets.COLLATERAL | StatTargets.VAULT,
            group: StatGroups.COUNT,
            stats: [
                new FlipBidTotalsStat()
            ]
        });
    }

    combineStats (bucket, [totals]) {
        return totals.extraData.count ?? 0;
    }

}