import moment from 'moment';

export default class Block {

    constructor (data) {
        this.number = parseInt(data.blockNumber);
        this.timestamp = moment.unix(data.blockTimestamp);
    }

}