import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, StatGroups, StatCategories } from 'api/model';
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
            aggregation: StatAggregations.SUM,
            group: StatGroups.AUCTION_DAI,
            stats: [
                new BiteTotalsStat()
            ]
        });
    }

    combine ([totals]) {
        return totals.extraData.tab;
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
            aggregation: StatAggregations.SUM,
            group: StatGroups.AUCTION_DAI,
            stats: [
                new FlipBidTotalsStat()
            ]
        });
    }

    combine ([totals]) {
        return totals.extraData.bidAmountEnd;
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
            aggregation: StatAggregations.SUM,
            group: StatGroups.AUCTION_DAI,
            stats: [
                new BiteTotalsStat(),
                new FlipBidTotalsStat()
            ]
        });
    }

    combine ([bites, flips]) {
        return (flips != null ? flips.extraData.bidAmountEnd : 0) - (bites != null ? bites.extraData.tab : 0);
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
            aggregation: StatAggregations.SUM,
            group: StatGroups.AUCTION_COLLATERAL,
            stats: [
                new BiteTotalsStat()
            ]
        });
    }

    combine ([totals]) {
        return totals.extraData.ink;
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
            aggregation: StatAggregations.SUM,
            group: StatGroups.AUCTION_DAI,
            stats: [
                new BiteTotalsStat(),
                new IlkSnapshotStat()
            ]
        });
    }

    combine ([bites, ilkSnapshot]) {
        return bites.extraData.ink * ilkSnapshot.extraData.price;
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
            aggregation: StatAggregations.SUM,
            group: StatGroups.COUNT,
            stats: [
                new FlipBidTotalsStat()
            ]
        });
    }

    combine ([totals]) {
        return totals.extraData.count;
    }

}