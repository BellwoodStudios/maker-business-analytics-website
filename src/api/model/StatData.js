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
        const granularity = query.getMomentGranularity();
        let curr = query.start.clone().startOf(granularity);
        // Want to inclusively add the last period
        const end = query.end.clone().startOf(granularity).add(1, granularity);
        this.packedData = [];
        let lastUsedIndex = -1;
        while (curr.isBefore(end)) {
            const endOfPeriod = curr.clone().add(1, granularity);
            let value = null;
            switch (this.stat.type) {
                case StatTypes.VALUE:
                case StatTypes.VALUE_OF_EVENT:
                    // Find the most recent value that is still before the end period
                    for (let i = lastUsedIndex + 1; i < this.data.length; i++) {
                        if (this.data[i].block.timestamp.isSameOrBefore(endOfPeriod, granularity)) {
                            lastUsedIndex = i;
                        } else {
                            break;
                        }
                    }
                    if (lastUsedIndex >= 0) value = this.data[lastUsedIndex].value;

                    break;
                case StatTypes.EVENT:
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
        if (stat.type === StatTypes.EVENT) {
            // Event-based stats do not override previous values -- they need to all be counted exactly once.
            // Require each stat to have identical number of rows for proper merging
            const results = [];

            for (let i = 0; i < statDataArray[0].data.length; i++) {
                const row = [];
                for (let o = 0; o < statDataArray.length; o++) {
                    const d = statDataArray[o].data[i];
                    row.push(d.clone());
                }
                let total = stat.combine(row);
                results.push(new StatDataItem({ block:statDataArray[0].data[i].block, value:total, extraData:{ ...statDataArray[0].data[i].extraData } }));
            }

            return new StatData({
                stat,
                data: results
            });
        } else {
            // Value stats are more flexible because next values override previous ones
            const combined = new StatData({
                stat,
                data: statDataArray.flatMap((sd, i) => sd.data.map(d => new StatDataItem({ block:d.block, value:d.value, extraData:{ ...d.extraData, _sourceIndex:i } })))
            });
            const values = statDataArray.map(_ => null);
            for (const d of combined.data) {
                values[d.extraData._sourceIndex] = d.clone();
    
                const combinedValue = stat.combine(values);
                if (typeof combinedValue === 'object') {
                    Object.assign(d, combinedValue);
                } else {
                    d.value = combinedValue;
                }
            }
    
            return combined;
        }
    }

}

/**
 * A single piece of data.
 */
export class StatDataItem {

    constructor (data) {
        this.bucket = data.bucket;
        this.value = data.value;
        this.extraData = data.extraData ?? {};
    }

    clone () {
        return new StatDataItem({
            ...this
        })
    }

}