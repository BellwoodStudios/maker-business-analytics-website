/**
 * A collateral type such as ETH.
 */
export default class Collateral {

    constructor (data) {
        this.name = data.name;
        this.vaults = [];
        if (data.vaults != null) {
            for (const vault of data.vaults) {
                this.addVault(vault);
            }
        }
    }

    addVault (vault) {
        this.vaults.push(vault);
        vault.collateral = this;
    }

    /**
     * Return the collateral string name identifier from the vault identifier.
     */
    static getCollateralNameFromVaultIdentifier (vaultIdentifier) {
        return vaultIdentifier.split("-")[0];
    }

    /**
     * Create a new collateral instance from the vault.
     */
    static createCollateralFromVault (vault) {
        return new Collateral({ name:Collateral.getCollateralNameFromVaultIdentifier(vault.identifier), vaults:[vault] });
    }

}