/**
 * A vault type such as ETH-A.
 */
export default class Vault {

    constructor (data) {
        this.id = data.id;
        this.ilk = data.ilk;
        this.identifier = data.identifier;
        this.name = data.identifier;
    }

}