import { transpose } from 'utils';
import { StatTypes } from 'api/model';

/**
 * Time series data for a particular stat.
 */
export default class StatData {

    constructor (data) {
        this.stat = data.stat;
        this.data = data.data;

        // Sort by default
        this.sort();
    }

    /**
     * Pack the data into the buckets the query expects.
     */
    async pack (query) {
        this.data = (await query.getBuckets()).map(bucket => {
            const filteredData = this.data.filter(d => {
                return bucket.bucketStart.isSameOrBefore(d.bucket.bucketStart) && bucket.bucketEnd.isSameOrAfter(d.bucket.bucketEnd);
            });
            if (filteredData.length > 0) {
                const mergedData = this.stat.combineTime(bucket, filteredData);
                mergedData.bucket = bucket;
                return mergedData;
            } else {
                return new StatDataItem({
                    bucket: bucket,
                    value: this.stat.type === StatTypes.VALUE ? null : 0
                });
            }
        });
    }

    /**
     * Sort data by bucket.
     */
    sort () {
        this.data.sort((a, b) => a.bucket.bucketStart.isSameOrBefore(b.bucket.bucketStart) ? -1 : 1);
    }

    /**
     * Merge one or more stats together.
     */
    static merge (stat, statDataArray) {
        return new StatData({
            stat: stat,
            data: transpose(statDataArray.map(sd => sd.data)).map(row => {
                return new StatDataItem({
                    bucket: row[0].bucket,
                    value: stat.combineStats(row[0].bucket, row)
                });
            })
        });
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