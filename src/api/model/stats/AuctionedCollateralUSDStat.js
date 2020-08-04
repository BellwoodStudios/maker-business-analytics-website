import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, StatGroups, StatCategories } from 'api/model';
import { BiteTotalsStat } from './AuctionTotalsStats';
import IlkSnapshotStat from './IlkSnapshotStat';

export default class AuctionedCollateralStat extends Stat {

    constructor () {
        super({
            name: "Auctioned Collateral USD",
            color: "#F4B731",
            category: StatCategories.COLLATERAL_AUCTION,
            type: StatTypes.EVENT,
            format: StatFormats.NUMBER,
            targets: StatTargets.COLLATERAL | StatTargets.VAULT,
            aggregation: StatAggregations.SUM,
            group: StatGroups.AUCTION_DAI,
            stats: [
                new BiteTotalsStat(),
                new IlkSnapshotStat()
            ]
        });
    }

    combine ([bites, ilkSnapshot]) {
        return bites.extraData.ink * ilkSnapshot.extraData.price;
    }

}