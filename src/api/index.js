import { timeout } from 'utils/AsyncUtils';

let _vaults = null;
let _collateral = null;

/**
 * Get all vaults and cache it for future use.
 */
async function fetchVaults () {
    if (_vaults === null) {
        try {
            // TODO this should be configurable
            var result = await (await fetch("http://localhost:5000/graphql", {
                method: "POST",
                headers: new Headers({
                    "Content-Type": "application/json"
                }),
                body: JSON.stringify({
                    query: `
                        {
                            allIlks {
                                nodes {
                                    id,
                                    ilk,
                                    identifier
                                }
                            }
                        }
                    `
                })
            })).json();
    
            _vaults = result.data.allIlks.nodes.map(ilk => {
                return {
                    id: ilk.id,
                    ilk: ilk.ilk,
                    identifier: ilk.identifier
                };
            });
        } catch {
            await timeout(1000);

            // Fallback to mock api for now if no connection available
            alert("PostGraphile not running.")
    
            _vaults = [
                { id:1, ilk:"ilk1", identifier:"ETH-A" },
                { id:2, ilk:"ilk2", identifier:"BAT-A" },
                { id:3, ilk:"ilk3", identifier:"USDC-A" }
            ];
        }
    }

    // Hook up all the data
    _collateral = [];
    for (const vault of _vaults) {
        const name = vault.identifier.split("-")[0];
        let collateral = _collateral.find(c => c.name === name);
        if (collateral == null) {
            _collateral.push(collateral = {
                name,
                ticker: name,
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
export async function getVaults ({ collateral }) {
    await fetchVaults();

    return _vaults.filter(v => collateral != null && v.collateral.name === collateral);
}

/**
 * Get a list of all stats available with optional vault/collateral filters.
 */
export async function getAvailableStats ({ vault, collateral }) {
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
