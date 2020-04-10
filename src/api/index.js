import { timeout } from 'utils/AsyncUtils';

let _vaults = null;
let _collateral = null;

async function query (graphql) {
    // TODO this should be configurable
    return (await fetch("http://localhost:5000/graphql", {
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
 * Get all vaults and cache it for future use.
 */
async function fetchVaults () {
    if (_vaults === null) {
        const result = await query(`
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

        _vaults = result.data.allIlks.nodes.map(ilk => {
            return {
                id: ilk.id,
                ilk: ilk.ilk,
                identifier: ilk.identifier
            };
        });
    }

    // Hook up all the data
    _collateral = [];
    for (const vault of _vaults) {
        const name = vault.identifier.split("-")[0];
        let collateral = _collateral.find(c => c.name === name);
        if (collateral == null) {
            _collateral.push(collateral = {
                name,
                vaults: []
            });
        }
        vault.collateral = collateral;
        collateral.vaults.push(vault);
    }

    return _vaults;
}

/**
 * Get a list of all available collateral types.
 */
export async function getCollateral () {
    await fetchVaults();

    return _collateral;
}

/**
 * Get a list of all vaults with optional collateral filter.
 */
export async function getCollateralByName (collateralName) {
    await fetchVaults();

    return _collateral.find(c => c.name === collateralName);
}

/**
 * Get a list of all vaults with optional collateral filter.
 */
export async function getVaults ({ collateralName }) {
    await fetchVaults();

    return _vaults.filter(v => collateralName != null && v.collateral.name === collateralName);
}

/**
 * Get a list of all vaults with optional collateral filter.
 */
export async function getVaultByName (vaultName) {
    await fetchVaults();

    return _vaults.find(v => v.name === vaultName);
}

/**
 * Get a list of all stats available with optional vault/collateral filters.
 */
export async function getAvailableStats ({ vaultName, collateralName }) {
    await timeout(1000);

    return [
        {
            name: "Dai Supply",
            type: "number",
            value: 1280000000,
            color: "#1AAB9B"
        },
        {
            name: "Stability Fee",
            type: "percent",
            value: 0.0725,
            color: "#F4B731"
        },
        {
            name: "Revenue",
            type: "number",
            value: 234743,
            color: "#F4B731"
        },
        {
            name: "Liquidations",
            type: "number",
            value: 43,
            color: "#F4B731"
        },
        {
            name: "Collateral",
            type: "number",
            value: 2234945,
            color: "#F4B731"
        }
    ];
}

/**
 * Fetch the fees for a particular vault type over time.
 */
export async function getFees (vaultId) {
    const result = await query(`
        {
            allJugFileIlks {
                nodes {
                    id,
                    headerId,
                    ilkId,
                    what,
                    data
                }
            }
        }
    `);

    // TODO - shouldn't be filtering on client for performance reasons
    return result.data.allJugFileIlks.nodes.filter(n => n.what === "duty" && n.ilkId === vaultId).map(n => {
        return {
            headerId: n.headerId,               // TODO - get timestamp from block id
            fee: Math.pow(n.data, 31536000)     // TODO - need bignum library
        };
    });
}
