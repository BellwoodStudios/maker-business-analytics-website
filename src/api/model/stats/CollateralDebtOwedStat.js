import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, StatGroups, StatCategories } from 'api/model';
import { BiteTotalsStat } from './AuctionTotalsStats';

export default class CollateralDebtOwedStat extends Stat {

    constructor () {
        super({
            name: "Debt Owed",
            color: "#FF4081",
            category: StatCategories.COLLATERAL_AUCTION,
            type: StatTypes.EVENT,
            format: StatFormats.NUMBER,
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