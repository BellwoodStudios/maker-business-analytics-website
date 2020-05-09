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
     * 
     * Since there is not really a concept of "collateral" in Maker, we have to follow naming conventions and probably adapt
     * as the system grows.
     */
    static getCollateralNameFromVaultIdentifier (vaultIdentifier) {
        const collateralPart = vaultIdentifier.split("-")[0];

        // Sometimes we are using wrapper tokens for the same underlying token
        const collateralGroups = ["BTC", "USD"];
        const collateralGroup = collateralGroups.find(g => collateralPart.indexOf(g) >= 0);

        return collateralGroup ?? collateralPart;
    }

    /**
     * Create a new collateral instance from the vault.
     */
    static createCollateralFromVault (vault) {
        return new Collateral({ name:Collateral.getCollateralNameFromVaultIdentifier(vault.identifier), vaults:[vault] });
    }

}