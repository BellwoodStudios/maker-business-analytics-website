import moment from 'moment';

/**
 * A bucket is a time period with optional blocks associated with those end points.
 * 
 * blockStart is the first block occurring greater than or equal to bucketStart.
 * blockEnd is the first block occurring greater than or equal to bucketEnd.
 * 
 * Start is inclusive and end is exclusive.
 */
export default class Bucket {

    constructor (data) {
        this.bucketStart = typeof(data.bucketStart) === 'string' ? moment.utc(data.bucketStart) : moment(data.bucketStart);
        this.bucketEnd = typeof(data.bucketEnd) === 'string' ? moment.utc(data.bucketEnd) : moment(data.bucketEnd);
        this.blockStart = data.blockStart;
        this.blockEnd = data.blockEnd;
    }

    contains (bucket) {
        return this.bucketStart.isSameOrBefore(bucket.bucketStart) && this.bucketEnd.isSameOrAfter(bucket.bucketEnd);
    }

}