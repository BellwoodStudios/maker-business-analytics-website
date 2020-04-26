import { QueryGranularity } from 'model';
import { StatAggregations, StatTypes } from 'api/model';
import { arraySum, arrayAvg } from 'utils';

/**
 * Time series data for a particular stat.
 */
export default class StatData {

    constructor (data) {
        this.stat = data.stat;
        this.data = data.data;
        this.packedData = null;

        // Do this by default
        this.sortByBlock();
    }

    /**
     * Pack the data into the format expected by the query.
     */
    pack (query) {
        // Iterate along the granularity of the query
        let granularity;
        switch (query.granularity) {
            case QueryGranularity.HOUR: granularity = 'hour'; break;
            case QueryGranularity.DAY: granularity = 'day'; break;
            case QueryGranularity.WEEK: granularity = 'week'; break;
            case QueryGranularity.MONTH: granularity = 'month'; break;
            case QueryGranularity.YEAR: granularity = 'year'; break;
            default: throw new Error(`Unknown granularity: '${query.granularity}'`);
        }
        let curr = query.start.clone().startOf(granularity);
        // Want to inclusively add the last period
        const end = query.end.clone().startOf(granularity).add(1, granularity);
        this.packedData = [];
        while (curr.isBefore(end)) {
            const endOfPeriod = curr.clone().add(1, granularity);
            let value = null;
            switch (this.stat.type) {
                case StatTypes.VALUE:
                    // Find the most recent value
                    const beforeEntries = this.data.filter(d => d.block.timestamp.isSameOrBefore(curr, granularity));
                    if (beforeEntries.length > 0) value = beforeEntries[beforeEntries.length - 1].value;

                    break;
                case StatAggregations.EVENT:
                    // Apply the aggregation function on all the values that occur in this period
                    const aggf = this.stat.aggregation === StatAggregations.SUM ? arraySum : arrayAvg;
                    value = aggf(this.data.filter(d => d.block.timestamp.isBetween(curr, endOfPeriod, granularity, "[)")).map(d => d.value));

                    break;
                default: throw new Error(`Unknown aggregation method: '${this.stat.aggregation}'`);
            }

            this.packedData.push({
                timestamp: curr.clone(),
                value
            })

            curr.add(1, granularity);
        }
    }

    /**
     * Sort data by block.
     */
    sortByBlock () {
        this.data.sort((a, b) => a.block.number < b.block.number ? -1 : 1);
    }

    /**
     * Using the extraData.group as an index, we will split apart the stat then recombine it properly.
     */
    mergeByGroup () {
        const groups = Array.from(new Set(this.data.map(d => d.extraData.group)));
        return StatData.merge(this.stat, groups.map(g => new StatData({ stat:this, data:this.data.filter(d => d.extraData.group === g) })));
    }

    /**
     * Merge two or more stat datas together according to the stat rules. Returns a single, merged stat data.
     */
    static merge (stat, statDataArray) {
        const combined = new StatData({
            stat,
            data: statDataArray.flatMap((sd, i) => sd.data.map(d => new StatDataItem({ block:d.block, value:d.value, extraData:{ ...d.extraData, _sourceIndex:i } })))
        });
        const values = statDataArray.map(_ => null);
        for (const d of combined.data) {
            values[d.extraData._sourceIndex] = d.clone();

            d.value = stat.combine(values);
        }

        return combined;
    }

}

/**
 * A single piece of data.
 */
export class StatDataItem {

    constructor (data) {
        this.block = data.block;
        this.value = data.value;
        this.extraData = data.extraData ?? {};
    }

    clone () {
        return new StatDataItem({
            ...this
        })
    }

}