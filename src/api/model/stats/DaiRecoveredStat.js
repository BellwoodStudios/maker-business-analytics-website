import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, StatGroups, StatCategories } from 'api/model';
import { FlopBidTotalsStat } from './AuctionTotalsStats';

export default class DaiAuctionedStat extends Stat {

    constructor () {
        super({
            name: "Dai Recovered",
            color: "#ABEB63",
            category: StatCategories.DEBT_AUCTION,
            type: StatTypes.EVENT,
            format: StatFormats.NUMBER,
            targets: StatTargets.ALL,
            aggregation: StatAggregations.SUM,
            group: StatGroups.AUCTION_DAI,
            stats: [
                new FlopBidTotalsStat()
            ]
        });
    }

    combine ([totals]) {
        return totals.extraData.bidAmountEnd;
    }

}