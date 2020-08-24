import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, StatGroups, StatCategories } from 'api/model';
import { FlapBidTotalsStat } from './base/AuctionTotalsStats';

export class MakerBurnedStat extends Stat {

    constructor () {
        super({
            name: "MKR Burned",
            color: "#ABEB63",
            category: StatCategories.SURPLUS_AUCTION,
            type: StatTypes.EVENT,
            format: StatFormats.NUMBER,
            targets: StatTargets.ALL,
            aggregation: StatAggregations.SUM,
            group: StatGroups.AUCTION_COLLATERAL,
            stats: [
                new FlapBidTotalsStat()
            ]
        });
    }

    combine ([totals]) {
        return totals.extraData.bidAmountEnd;
    }

}

export class DaiAuctionedStat extends Stat {

    constructor () {
        super({
            name: "Dai Auctioned",
            color: "#FF4081",
            category: StatCategories.SURPLUS_AUCTION,
            type: StatTypes.EVENT,
            format: StatFormats.NUMBER,
            targets: StatTargets.ALL,
            aggregation: StatAggregations.SUM,
            group: StatGroups.AUCTION_DAI,
            stats: [
                new FlapBidTotalsStat()
            ]
        });
    }

    combine ([totals]) {
        return totals.extraData.lotEnd;
    }

}

export class SurplusAuctionsCountStat extends Stat {

    constructor () {
        super({
            name: "Auctions Count",
            color: "#3FDFC9",
            category: StatCategories.SURPLUS_AUCTION,
            type: StatTypes.EVENT,
            format: StatFormats.NUMBER,
            targets: StatTargets.ALL,
            aggregation: StatAggregations.SUM,
            group: StatGroups.COUNT,
            stats: [
                new FlapBidTotalsStat()
            ]
        });
    }

    combine ([totals]) {
        return totals.extraData.count;
    }

}