import { feeToAPY, sumFees } from 'utils/MathUtils';
import moment from 'moment';
import { Vault, Collateral } from 'api/model';
import StabilityFeeStat from 'api/model/stats/StabilityFeeStat';

let _vaults = null;
let _collateral = null;
const _stats = [
    new StabilityFeeStat()
];

async function query (graphql) {
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
    //const collateral = collateralName != null ? await getCollateralByName(collateralName) : null;

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
        default:
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
