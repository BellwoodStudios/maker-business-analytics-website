import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, StatGroups, StatCategories } from 'api/model';
import { FlipBidTotalsStat, BiteTotalsStat } from './AuctionTotalsStats';
import { fromRad } from 'utils/MathUtils';

export default class CollateralSurplusStat extends Stat {

    constructor () {
        super({
            name: "Surplus",
            color: "#83D17E",
            category: StatCategories.COLLATERAL_AUCTION,
            type: StatTypes.EVENT,
            format: StatFormats.NUMBER,
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
        return (flips != null ? fromRad(flips.extraData.bidAmountEnd) : 0) - (bites != null ? fromRad(bites.extraData.tab) : 0);
    }

}