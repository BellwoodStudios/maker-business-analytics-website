import moment from 'moment';

export default class Block {

    constructor (data) {
        this.id = data.id;
        this.number = parseInt(data.blockNumber);
        this.timestamp = data.blockTimestamp != null ? moment.unix(data.blockTimestamp) : moment.utc(data.updated).local();
    }

}