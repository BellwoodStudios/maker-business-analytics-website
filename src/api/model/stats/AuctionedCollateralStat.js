import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, StatGroups, StatCategories } from 'api/model';
import { BiteTotalsStat } from './AuctionTotalsStats';

export default class AuctionedCollateralStat extends Stat {

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