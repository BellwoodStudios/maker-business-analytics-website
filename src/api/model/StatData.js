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
        let lastSeenIndex = -1;
        this.data = (await query.getBuckets()).map(bucket => {
            // Move the last seen value up to the beginning of this bucket
            while (lastSeenIndex + 1 < this.data.length && this.data[lastSeenIndex + 1].bucket.bucketStart.isSameOrBefore(bucket.bucketStart)) {
                lastSeenIndex++;
            }

            const filteredData = this.data.filter(d => {
                return bucket.contains(d.bucket);
            });
            if (filteredData.length === 0 && this.stat.type === StatTypes.VALUE && lastSeenIndex !== -1) {
                // Use the last seen value
                filteredData.push(this.data[lastSeenIndex]);
            }
            if (filteredData.length > 0) {
                const mergedData = this.stat.combineTime(bucket, filteredData).clone();
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