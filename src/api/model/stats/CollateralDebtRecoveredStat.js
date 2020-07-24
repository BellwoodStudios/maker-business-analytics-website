import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, StatGroups, StatCategories } from 'api/model';
import { FlipBidTotalsStat } from './AuctionTotalsStats';
import { fromRad } from 'utils/MathUtils';

export default class CollateralDebtRecoveredStat extends Stat {

    constructor () {
        super({
            name: "Debt Recovered",
            color: "#3FDFC9",
            category: StatCategories.COLLATERAL_AUCTION,
            type: StatTypes.VALUE,
            format: StatFormats.NUMBER,
            targets: StatTargets.COLLATERAL | StatTargets.VAULT,
            aggregation: StatAggregations.SUM,
            group: StatGroups.AUCTION_DAI,
            stats: [
                new FlipBidTotalsStat()
            ]
        });
    }

    combine ([totals]) {
        return fromRad(totals.extraData.bidAmountEnd);
    }

}