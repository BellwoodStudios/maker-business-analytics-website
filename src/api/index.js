import { Vault, Collateral, Block } from 'api/model';
import StabilityFeeStat from 'api/model/stats/StabilityFeeStat';
import DaiSavingsRateStat from 'api/model/stats/DaiSavingsRateStat';
import DaiSupplyStat from 'api/model/stats/DaiSupplyStat';
import CollateralPriceStat from 'api/model/stats/CollateralPriceStat';
import DebtCeilingStat from 'api/model/stats/DebtCeilingStat';
import SystemSurplusStat from 'api/model/stats/SystemSurplusStat';
import SystemDebtStat from 'api/model/stats/SystemDebtStat';
import SavingsDaiStat from 'api/model/stats/SavingsDaiStat';
import CollateralLockedStat from 'api/model/stats/CollateralLockedStat';
import CollateralLiquidationsStat from 'api/model/stats/CollateralLiquidationsStat';
import AuctionedCollateralStat from 'api/model/stats/AuctionedCollateralStat';
import CollateralDebtOwedStat from 'api/model/stats/CollateralDebtOwedStat';

let _config = null;
let _vaults = null;
let _collateral = null;
let _latestBlock = null;
const _stats = [
    new DaiSupplyStat(),
    //new CollateralLockedStat(),
    new StabilityFeeStat(),
    new DaiSavingsRateStat(),
    //new SavingsDaiStat(),
    new CollateralPriceStat(),
    new DebtCeilingStat(),
    new SystemSurplusStat(),
    new SystemDebtStat(),
    new CollateralLiquidationsStat(),
    new AuctionedCollateralStat(),
    new CollateralDebtOwedStat()
];

function statLookup (statTypes) {
    return statTypes.map(st => _stats.find(s => s instanceof st));
}

/**
 * Stats to be shown by default on the global view.
 */
export const defaultGlobalStats = statLookup([
    DaiSupplyStat,
    DaiSavingsRateStat,
    SavingsDaiStat,
    DebtCeilingStat
]);

/**
 * Stats to be shown by default on the collateral/vault view.
 */
export const defaultVaultStats = statLookup([
    DaiSupplyStat,
    CollateralLockedStat,
    StabilityFeeStat,
    CollateralPriceStat,
    DebtCeilingStat
]);

// Query cache
const cache = {};

export async function fetchGraphQL (graphql) {
    if (cache[graphql] != null) {
        return await cache[graphql];
    }
    
    const promise = fetch(_config.api.endpoint, {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
            ...(_config.api.user != null ? {
                "Authorization": 'Basic ' + btoa(_config.api.user + ":" + _config.api.pass)
            } : {})
        }),
        body: JSON.stringify({
            query: graphql
        })
    }).then(res => res.json())

    cache[graphql] = promise;

    return await promise;
}

/**
 * Initialize the collateral types. This must be called before using the api.
 */
export async function init () {
    _config = await (await fetch("/config.json")).json();

    const result = await fetchGraphQL(`
        {
            allIlks {
                nodes {
                    id
                }
            },
            allStorageDiffs(last:1, condition:{ checked:true }) {
                nodes {
                    blockHeight
                }
            }
        }
    `);
    const latestBlockResult = await fetchGraphQL(`
        {
            allHeaders(condition:{ blockNumber:"${result.data.allStorageDiffs.nodes[0].blockHeight}" }) {
                nodes {
                    blockNumber,
                    blockTimestamp
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

    // Set latest block
    _latestBlock = new Block(latestBlockResult.data.allHeaders.nodes[0]);
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
 * Get a list of all available vault types.
 */
export function getVaults () {
    return _vaults;
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

export function getStatByName (name) {
    return _stats.find(s => s.name === name);
}

export function getLatestBlock () {
    return _latestBlock;
}