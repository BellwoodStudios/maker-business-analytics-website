import { QueryGranularity } from 'model';
import { StatAggregations } from 'api/model';
import { arraySum } from 'utils';

/**
 * Time series data for a particular stat.
 */
export default class StatData {

    constructor (data) {
        this.stat = data.stat;
        this.data = data.data;
        this.packedData = null;
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
        const end = query.end.clone().startOf(granularity).add(granularity, 1);
        this.packedData = [];
        while (curr.isBefore(end)) {
            const endOfPeriod = curr.clone().add(granularity, 1);
            let value = null;
            switch (this.stat.aggregation) {
                case StatAggregations.REPLACE:
                    // Find the most recent value
                    const beforeEntries = this.data.filter(d => d.block.timestamp.isSameOrBefore(curr, granularity));
                    if (beforeEntries.length > 0) value = beforeEntries[beforeEntries.length - 1].value;

                    break;
                case StatAggregations.SUM:
                    // Sum up all the values that occur in this period
                    value = arraySum(this.data.filter(d => d.block.timestamp.isBetween(curr, endOfPeriod, granularity, "[)")).map(d => d.value));

                    break;
                default: throw new Error(`Unknown aggregation method: '${this.stat.aggregation}'`);
            }

            this.packedData.push({
                timestamp: curr.clone(),
                value
            })

            curr.add(granularity, 1);
        }
    }

}

/**
 * A single piece of data.
 */
export class StatDataItem {

    constructor (data) {
        this.block = data.block;
        this.value = data.value;
        this.extraData = data.extraData;
    }

}