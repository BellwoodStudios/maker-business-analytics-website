import { Vault, Collateral } from 'api/model';
import StabilityFeeStat from 'api/model/stats/StabilityFeeStat';

let _vaults = null;
let _collateral = null;
const _stats = [
    new StabilityFeeStat()
];

export async function fetchGraphQL (graphql) {
    // TODO this should be configurable
    return (await fetch("https://vulcanize.mkranalytics.com/graphql", {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json"
        }),
        body: JSON.stringify({
            query: graphql
        })
    })).json();
}

/**
 * Initialize the collateral types. This must be called before using the api.
 */
export async function init () {
    const result = await fetchGraphQL(`
        {
            allIlks {
                nodes {
                    id,
                    ilk,
                    identifier
                }
            }
        }
    `);

    // Parse vaults
    _vaults = result.data.allIlks.nodes.map(ilk => new Vault(ilk));

    // Hook up all the data
    _collateral = [];
    for (const vault of _vaults) {
        const name = Collateral.getCollateralNameFromVaultIdentifier(vault.identifier);
        const collateral = _collateral.find(c => c.name === name);
        if (collateral == null) {
            _collateral.push(Collateral.createCollateralFromVault(vault));
        } else {
            collateral.addVault(vault);
        }
    }
}

/**
 * Get a list of all available collateral types.
 */
export function getCollateral () {
    return _collateral;
}

/**
 * Get a list of all vaults with optional collateral filter.
 */
export function getCollateralByName (collateralName) {
    return _collateral.find(c => c.name === collateralName);
}

/**
 * Get a list of all vaults with optional collateral filter.
 */
export function getVaultById (vaultId) {
    return _vaults.find(v => v.id === vaultId);
}

/**
 * Get a list of all vaults with optional collateral filter.
 */
export function getVaultByName (vaultName) {
    return _vaults.find(v => v.name === vaultName);
}

/**
 * Get a list of all available stats. If query is supplied then will filter to the given query.
 */
export function getStats (query) {
    return query != null ? _stats.filter(s => s.isAvailableForQuery(query)) : _stats;
}

/*const statList = [
    {
        name: "Dai Supply",
        type: "number",
        aggregate: "sum"
    },
    {
        name: "Stability Fee",
        type: "percent",
        target: "vault-only",
        substats: [
            {
                name: "Base Fee",
                type: "percent"
            },
            {
                name: "Vault Fee",
                type: "percent"
            }
        ]
    },
    {
        name: "Base Fee",
        type: "percent",
        target: "global-only"
    },
    {
        name: "Revenue",
        type: "number",
        aggregate: "sum"
    },
    {
        name: "Liquidations",
        type: "number",
        aggregate: "sum"
    },
    {
        name: "Collateral",
        type: "number",
        aggregate: "sum"
    }
];*/
