import { Vault, Collateral, Block } from 'api/model';
import { StabilityFeeStat, StabilityFeeRevenueStat, DaiSavingsRateStat, SavingsDaiCostStat, FeeProfitStat } from 'api/model/stats/FeeStats';
import { DaiSupplyStat, DebtCeilingStat, SavingsDaiStat } from 'api/model/stats/DaiSupplyStats';
import { CollateralPriceStat } from 'api/model/stats/CollateralStats';
import {
    AuctionedCollateralStat,
    AuctionedCollateralUSDStat,
    CollateralDebtOwedStat,
    CollateralDebtRecoveredStat,
    CollateralSurplusStat,
    LiquidationsCountStat
} from 'api/model/stats/CollateralAuctionStats';
import { MakerBurnedStat, DaiAuctionedStat, SurplusAuctionsCountStat } from 'api/model/stats/SurplusAuctionStats';
import { MakerMintedStat, DaiRecoveredStat, DebtAuctionsCountStat } from 'api/model/stats/DebtAuctionStats';
import { SurplusBufferStat, SystemRevenueStat, SystemCostStat, SystemProfitStat } from 'api/model/stats/SystemStats';
import { LocksStat, FreesStat, DrawsStat, WipesStat } from 'api/model/stats/VaultStats';

let _config = null;
let _vaults = null;
let _collateral = null;
let _latestBlock = null;
const _stats = [
    // Fees
    new StabilityFeeStat(),
    new StabilityFeeRevenueStat(),
    new DaiSavingsRateStat(),
    new SavingsDaiCostStat(),
    new FeeProfitStat(),

    // Dai Supply
    new DaiSupplyStat(),
    new DebtCeilingStat(),
    new SavingsDaiStat(),

    // Collateral
    //new CollateralLockedStat(),
    new CollateralPriceStat(),

    // Vaults
    new LocksStat(),
    new FreesStat(),
    new DrawsStat(),
    new WipesStat(),

    // System
    new SurplusBufferStat(),
    //new DebtBufferStat(),
    new SystemRevenueStat(),
    new SystemCostStat(),
    new SystemProfitStat(),

    // Collateral Auctions
    new CollateralDebtOwedStat(),
    new CollateralDebtRecoveredStat(),
    new CollateralSurplusStat(),
    new AuctionedCollateralStat(),
    new AuctionedCollateralUSDStat(),
    new LiquidationsCountStat(),

    // Surplus Auctions
    new MakerBurnedStat(),
    new DaiAuctionedStat(),
    new SurplusAuctionsCountStat(),

    // Debt Auctions
    new DaiRecoveredStat(),
    new MakerMintedStat(),
    new DebtAuctionsCountStat(),
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
    //SavingsDaiStat,
    DebtCeilingStat
]);

/**
 * Stats to be shown by default on the collateral/vault view.
 */
export const defaultVaultStats = statLookup([
    DaiSupplyStat,
    //CollateralLockedStat,
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
    try {
        _config = await (await fetch("/config.json")).json();
    } catch {
        _config = {
            "api": {
                "endpoint": "https://vulcanize.mkranalytics.com/graphql"
            }
        };
    }

    const result = await fetchGraphQL(`
        {
            allIlks {
                nodes {
                    ilkIdentifier
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
    return _stats.find(s => s.getLongName() === name);
}

export function getLatestBlock () {
    return _latestBlock;
}