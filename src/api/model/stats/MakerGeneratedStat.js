import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, StatGroups, StatCategories } from 'api/model';
import { FlopBidTotalsStat } from './AuctionTotalsStats';

export default class MakerBurnedStat extends Stat {

    constructor () {
        super({
            name: "MKR Generated",
            color: "#FF4081",
            category: StatCategories.DEBT_AUCTION,
            type: StatTypes.EVENT,
            format: StatFormats.NUMBER,
            targets: StatTargets.ALL,
            aggregation: StatAggregations.SUM,
            group: StatGroups.AUCTION_COLLATERAL,
            stats: [
                new FlopBidTotalsStat()
            ]
        });
    }

    combine ([totals]) {
        return totals.extraData.lotEnd;
    }

}