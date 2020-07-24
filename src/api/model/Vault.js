let NEXT_ID = 0;

/**
 * A vault type such as ETH-A.
 */
export default class Vault {

    constructor (data) {
        this.id = NEXT_ID++;
        this.ilk = data.ilkIdentifier;
        this.identifier = data.ilkIdentifier;
        this.name = data.ilkIdentifier;
    }

}