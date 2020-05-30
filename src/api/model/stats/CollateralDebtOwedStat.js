import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, StatGroups } from 'api/model';
import CollateralLiquidationsStat from './CollateralLiquidationsStat';
import { fromRad } from 'utils/MathUtils';

export default class AuctionedCollateralStat extends Stat {

    constructor () {
        super({
            name: "Collateral Debt Owed",
            color: "#83D17E",
            type: StatTypes.EVENT,
            format: StatFormats.NUMBER,
            targets: StatTargets.COLLATERAL | StatTargets.VAULT,
            aggregation: StatAggregations.SUM,
            group: StatGroups.AUCTION_DAI,
            stats: [
                new CollateralLiquidationsStat()
            ]
        });
    }

    combine ([liquidation]) {
        return fromRad(liquidation.extraData.tab);
    }

}