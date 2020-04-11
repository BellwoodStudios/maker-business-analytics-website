import { feeToAPY, sumFees } from 'utils/MathUtils';
import moment from 'moment';

let _vaultFetchPromise = null;
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
    if (_vaultFetchPromise === null) {
        const result = await (_vaultFetchPromise = query(`
            {
                allIlks {
                    nodes {
                        id,
                        ilk,
                        identifier
                    }
                }
            }
        `));

        _vaults = result.data.allIlks.nodes.map(ilk => {
            return {
                id: ilk.id,
                ilk: ilk.ilk,
                identifier: ilk.identifier,
                name: ilk.identifier
            };
        });
    } else {
        await _vaultFetchPromise;
        return _vaults;
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
export async function getVaultById (vaultId) {
    await fetchVaults();

    return _vaults.find(v => v.id === vaultId);
}

/**
 * Get a list of all vaults with optional collateral filter.
 */
export async function getVaultByName (vaultName) {
    await fetchVaults();
    
    return _vaults.find(v => v.name === vaultName);
}

const colors = [
    "#1AAB9B",
    "#F4B731",
    "#00E676",
    "#FF7043",
    "#26C6DA",
    "#448AFF",
    "#7E57C2",
    "#E040FB",
    "#FF4081",
    "#FF5252",
    "#9CCC65",
    "#5C6BC0",
    "#89A74D",
    "#B584FF",
    "#83D17E",
    "#3FDFC9",
    "#FFA143",
    "#4AC9F1",
    "#567FEE",
    "#7E57C2",
    "#FA65FF",
    "#FF658F",
    "#FF5D51",
    "#ABEB63",
    "#8287FF",
    "#89A74D",
    "#9C64FF",
    "#A4FF9E"
];

const statList = [
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
];

// Init all colors
let index = 0;
for (const stat of statList) {
    stat.color = colors[(index++) % colors.length];
    if (stat.substat != null) {
        for (const substat of stat.substats) {
            substat.color = colors[(index++) % colors.length];
        }
    }
}

/**
 * Get a list of all stats available with optional vault/collateral filters.
 */
export async function getAvailableStats ({ vaultName, collateralName }) {
    if (vaultName != null) {
        // Vault-level stat
        return statList.filter(s => s.target == null || s.target === "vault-only");
    } else if (collateralName != null) {
        // Collateral-level stat
        return statList.filter(s => s.target == null || s.target === "collateral-only");
    } else {
        // Global stat
        return statList.filter(s => s.target == null || s.target === "global-only");
    }
}

/**
 * Fetch data for all the requested stats.
 */
export async function getStatsData (stats, options) {
    return Promise.all(stats.map(s => {
        return getStatData(s, options);
    }));
}

/**
 * Fetch data for a given stat with required start, end and granularity filters.
 */
export async function getStatData (stat, { vaultName, collateralName, start, end, granularity }) {
    let result = null;

    const vault = vaultName != null ? await getVaultByName(vaultName) : null;
    const collateral = collateralName != null ? await getCollateralByName(collateralName) : null;

    switch (stat.name) {
        case "Stability Fee":
            result = await fetchStabilityFees(vault);

            break;
        case "Base Fee":
            result = await fetchBaseFees();

            break;
        case "Vault Fee":
            result = await fetchVaultFees(vault);

            break;
    }

    return result;
}

function parseBlock (headerData) {
    return {
        number: headerData.blockNumber,
        timestamp: moment.unix(headerData.blockTimestamp)
    };
}

async function fetchVaultFees (vault) {
    const result = await query(`
        {
            allJugFileIlks {
                nodes {
                    id,
                    headerId,
                    ilkId,
                    what,
                    data,
                    headerByHeaderId {
                        blockNumber,
                        blockTimestamp
                    }
                }
            }
        }
    `);

    // TODO - shouldn't be filtering on client for performance reasons
    return Promise.all(result.data.allJugFileIlks.nodes.filter(n => n.what === "duty" && n.ilkId === vault.id).map(async n => {
        return {
            block: parseBlock(n.headerByHeaderId),
            compoundingFee: n.data,
            fee: feeToAPY(n.data),
            vault: await getVaultById(n.ilkId)
        };
    }));
}

async function fetchBaseFees () {
    const result = await query(`
        {
            allJugFileBases {
                nodes {
                    id,
                    headerId,
                    what,
                    data,
                    headerByHeaderId {
                        blockNumber,
                        blockTimestamp
                    }
                }
            }
        }
    `);

    // TODO - shouldn't be filtering on client for performance reasons
    return result.data.allJugFileBases.nodes.filter(n => n.what === "base").map(n => {
        return {
            block: parseBlock(n.headerByHeaderId),
            compoundingFee: n.data,
            fee: feeToAPY(n.data)
        };
    });
}

async function fetchStabilityFees (vault) {
    const combined = (await fetchVaultFees(vault)).concat(await fetchBaseFees());
    combined.sort((a, b) => a.block.number < b.block.number ? -1 : 1);

    let baseFee = 0;
    let vaultFee = 0;
    for (const stat of combined) {
        if (stat.vault != null) {
            // Vault fee
            vaultFee = stat.compoundingFee;
        } else {
            // Base fee
            baseFee = stat.compoundingFee;
        }

        stat.fee = feeToAPY(sumFees(baseFee, vaultFee));
    }

    return combined;
}
