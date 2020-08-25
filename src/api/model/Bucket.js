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
        this.bucketStart = moment(data.bucketStart);
        this.bucketEnd = moment(data.bucketEnd);
        this.blockStart = data.blockStart;
        this.blockEnd = data.blockEnd;
    }

}