import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, StatGroups, StatCategories } from 'api/model';
import { FlapBidTotalsStat } from './AuctionTotalsStats';

export default class MakerBurnedStat extends Stat {

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