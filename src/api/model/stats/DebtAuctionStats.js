import { Stat, StatTypes, StatTargets, StatFormats, StatGroups, StatCategories } from 'api/model';
import { FlopBidTotalsStat } from './base/AuctionTotalsStats';

export class MakerMintedStat extends Stat {

    constructor () {
        super({
            name: "MKR Minted",
            color: "#FF4081",
            category: StatCategories.DEBT_AUCTION,
            type: StatTypes.EVENT,
            format: StatFormats.NUMBER,
            targets: StatTargets.ALL,
            group: StatGroups.AUCTION_COLLATERAL,
            stats: [
                new FlopBidTotalsStat()
            ]
        });
    }

    combineStats (bucket, [totals]) {
        return totals.extraData.lotEnd ?? 0;
    }

}

export class DaiRecoveredStat extends Stat {

    constructor () {
        super({
            name: "Dai Recovered",
            color: "#ABEB63",
            category: StatCategories.DEBT_AUCTION,
            type: StatTypes.EVENT,
            format: StatFormats.DAI,
            targets: StatTargets.ALL,
            group: StatGroups.AUCTION_DAI,
            stats: [
                new FlopBidTotalsStat()
            ]
        });
    }

    combineStats (bucket, [totals]) {
        return totals.extraData.bidAmountEnd ?? 0;
    }

}

export class DebtAuctionsCountStat extends Stat {

    constructor () {
        super({
            name: "Auctions Count",
            color: "#3FDFC9",
            category: StatCategories.DEBT_AUCTION,
            type: StatTypes.EVENT,
            format: StatFormats.NUMBER,
            targets: StatTargets.ALL,
            group: StatGroups.COUNT,
            stats: [
                new FlopBidTotalsStat()
            ]
        });
    }

    combineStats (bucket, [totals]) {
        return totals.extraData.count ?? 0;
    }

}