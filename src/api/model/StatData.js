import moment from 'moment';

/**
 * Time series data for a particular stat.
 */
export default class StatData {

    constructor (data) {
        this.stat = data.stat;
        this.data = data.data;
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