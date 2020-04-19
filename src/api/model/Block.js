import moment from 'moment';

export default class Block {

    constructor (data) {
        this.number = data.blockNumber;
        this.timestamp = moment.unix(data.blockTimestamp);
    }

}