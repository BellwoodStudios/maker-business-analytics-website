import { parseDaiSupply } from 'utils/MathUtils';

let NEXT_ID = 0;

/**
 * A vault type such as ETH-A.
 */
export default class Vault {

    constructor (data) {
        this.id = NEXT_ID++;
        this.ilk = data.id;
        this.identifier = data.id;
        this.name = data.id;
        this.dai = data.art != null ? parseDaiSupply(data.art, data.rate) : 0;
    }

}