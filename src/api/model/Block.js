import moment from 'moment';

export default class Block {

    constructor (data) {
        this.id = data.id;
        if (data.bucketStart != null) {
            // Bucket time format
            this.timestamp = moment(data.bucketStart);
            this.number = this.timestamp.unix();
        } else {
            // Block format
            this.number = parseInt(data.blockNumber);
            this.timestamp = data.blockTimestamp != null ? moment.unix(data.blockTimestamp) : moment.utc(data.updated).local();
        }
    }

}