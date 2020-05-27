import { Stat, StatTypes, StatTargets, StatFormats, StatAggregations, Block, StatData, StatDataItem } from 'api/model';
import { fetchGraphQL } from 'api';
import { fromWad, fromRay } from 'utils/MathUtils';

export default class DaiSupplyStat extends Stat {

    constructor () {
        super({
            name: "Dai Supply",
            color: "#448AFF",
            type: StatTypes.VALUE,
            format: StatFormats.NUMBER,
            targets: StatTargets.ALL,
            aggregation: StatAggregations.SUM,
            group: "dai",
            stats: [
                new VatIlkArtStat(),
                new VatIlkRateStat()
            ]
        });
    }

    combine ([art, rate]) {
        if (art == null) {
            return null;
        } else if (rate == null) {
            return art.value;
        } else {
            return art.value * rate.value;
        }
    }

}

class VatIlkArtStat extends Stat {

    constructor () {
        super({
            type: StatTypes.VALUE
        });
    }

    async fetch (query) {
        const result = await fetchGraphQL(`
            {
                allVatIlkArts {
                    nodes {
                        headerId,
                        ilkId,
                        art,
                        headerByHeaderId {
                            blockNumber,
                            blockTimestamp
                        }
                    }
                }
            }
        `);

        // TODO - shouldn't be filtering on client for performance reasons
        const data = result.data.allVatIlkArts.nodes.filter(n => query.filterByIlk(n)).map(n => {
            return new StatDataItem({
                block: new Block(n.headerByHeaderId),
                value: fromWad(n.art),
                extraData: {
                    group: n.ilkId,
                    art: n.art
                }
            });
        });

        return new StatData({
            stat: this,
            data: data
        }).mergeByGroup();
    }

}

class VatIlkRateStat extends Stat {

    constructor () {
        super({
            type: StatTypes.VALUE
        });
    }

    async fetch (query) {
        const result = await fetchGraphQL(`
            {
                allVatIlkRates {
                    nodes {
                        headerId,
                        ilkId,
                        rate,
                        headerByHeaderId {
                            blockNumber,
                            blockTimestamp
                        }
                    }
                }
            }
        `);

        // TODO - shouldn't be filtering on client for performance reasons
        const data = result.data.allVatIlkRates.nodes.filter(n => query.filterByIlk(n)).map(n => {
            return new StatDataItem({
                block: new Block(n.headerByHeaderId),
                value: fromRay(n.rate),
                extraData: {
                    group: n.ilkId,
                    rate: n.rate
                }
            });
        });

        return new StatData({
            stat: this,
            data: data
        }).mergeByGroup();
    }

}