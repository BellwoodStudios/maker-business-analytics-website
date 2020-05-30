import { enumValidValue } from 'utils';
import { QueryType } from 'model';
import { StatData } from 'api/model';

/**
 * The category of the stat. Lower priority will sort to closer to the top.
 */
export const StatCategories = {
    FEES: {
        label: "Fee",
        priority: 0
    },
    SUPPLY: {
        label: "Supply",
        priority: 1
    },
    COLLATERAL: {
        label: "Collateral",
        priority: 2
    },
    SYSTEM: {
        label: "System",
        priority: 3
    },
    COLLATERAL_AUCTION: {
        label: "Collateral Auction",
        priority: 4
    },
    MISC: {
        label: "Misc",
        priority: 100
    }
};

/**
 * Value types are single values where the next time series value replaces the previous one. Ex) Stability Fee
 * Events are independant values that do not relate to the previous value. Ex) Vault Created
 */
export const StatTypes = {
    VALUE: 'value',
    EVENT: 'event'
};

export const StatFormats = {
    NUMBER: 'number',
    PERCENT: 'percent',
    DOLLARS: 'dollars'
};

/**
 * Bitflags for available targets.
 */
export const StatTargets = {
    GLOBAL: 1,
    COLLATERAL: 2,
    VAULT: 4,

    ALL: 7
};

/**
 * How to aggregate multiple results in the same granularity period.
 */
export const StatAggregations = {
    // Replace the previous value
    // Used for stats like Stability Fees where the next value replaces the previous one
    AVERAGE: 'average',
    // Sum all the values together
    // Used for stats like Dai Supply where all the values contribute to say the daily total for example
    SUM: 'sum'
};

/**
 * Group numbers that have similar ranges of values for a better chart display.
 */
export const StatGroups = {
    // Dai that contributes to the total outstanding Dai supply
    SUPPLY_DAI: 'SUPPLY_DAI',
    // Dai that contributes to the system accounting
    // This should be on the order of 1/100 of the total supply
    SYSTEM_DAI: 'SYSTEM_DAI',
    // Dai at the level of individual auctions
    AUCTION_DAI: 'AUCTION_DAI',
    // Collateral that contributes to the total supply
    SUPPLY_COLLATERAL: 'SUPPLY_COLLATERAL',
    // Collateral that contributes to the total supply (in USD)
    SUPPLY_COLLATERAL_USD: 'SUPPLY_COLLATERAL_USD',
    // Collateral at the level of individual auctions
    AUCTION_COLLATERAL: 'AUCTION_COLLATERAL',
    // Price for a single unit
    PRICE: 'PRICE',
    // An arbitrary event count such as Vaults Created
    COUNT: 'COUNT'
};

/**
    Use these colors for stats and mark them off when they are used:

    #1AAB9B - Stability Fee
    #F4B731 - Base Fee
    #00E676 - Vault Fee
    #FF7043 - New Vaults
    #26C6DA - Dai Savings Rate
    #448AFF - Dai Supply
    #7E57C2 - Collateral Price
    #E040FB - Debt Ceiling
    #ABEB63 - System Surplus
    #FF4081 - System Debt
    #5C6BC0 - Savings Dai
    #89A74D - Collateral Locked
    #FF5252 - Collateral Liquidations
    #B584FF - Auctioned Collateral
    #83D17E - Collateral Debt Owed
    #3FDFC9
    #FFA143
    #4AC9F1
    #567FEE
    #FA65FF
    #9CCC65
    #FF658F
    #FF5D51
    #8287FF
    #9C64FF
    #A4FF9E
 */

/**
 * A Maker stat such as Stability Fee. This class is the stat definition and not the actual data.
 * 
 * Stat is an abstract class and should be extended with a proper fetch() to perform the actual query.
 */
export default class Stat {

    constructor (data) {
        this.name = data.name;
        this.color = data.color;
        this.category = data.category ?? StatCategories.MISC;
        this.type = data.type ?? StatTypes.VALUE;
        this.format = data.format ?? StatFormats.NUMBER;
        this.targets = data.targets ?? StatTargets.ALL;
        this.aggregation = data.aggregation ?? StatAggregations.AVERAGE;
        this.stats = data.stats ?? [];
        this.group = data.group ?? this.format;

        enumValidValue(StatCategories, 'category', this.category);
        enumValidValue(StatTypes, 'type', this.type);
        enumValidValue(StatAggregations, 'aggregation', this.aggregation);
    }

    getLongName () {
        return `${this.category.label} - ${this.name}`;
    }

    /**
     * Returns true iff the stat is available for the provided query.
     */
    isAvailableForQuery (query) {
        // Allow global stats to be viewed in collateral / vault views
        switch (query.type) {
            case QueryType.GLOBAL:
                return (this.targets & StatTargets.GLOBAL) !== 0;
            case QueryType.COLLATERAL:
                return (this.targets & StatTargets.COLLATERAL) !== 0 || (this.targets & StatTargets.GLOBAL) !== 0;
            case QueryType.VAULT:
                return (this.targets & StatTargets.VAULT) !== 0 || (this.targets & StatTargets.GLOBAL) !== 0;
            default:
                return false;
        }
    }

    /**
     * Fetch all the child stats and combine them into a flattened, ordered StatDataItem array.
     */
    async fetchAllChildStats (query) {
        return Promise.all(this.stats.map(s => s.fetch(query)));
    }

    /**
     * Combine two values together. By default will just use the aggregation method.
     */
    combine (values) {
        let total = 0;
        for (const v of values) total += v != null ? v.value : 0;
        if (this.aggregation === StatAggregations.AVERAGE) total /= values.length;
        return total;
    }

    /**
     * Fetch stat data given the query. This is abstract and needs a subclass implementation.
     */
    async fetch (query) {
        if (this.stats.length > 0) {
            // Stat is built out of one or more sub-stats
            return StatData.merge(this, await this.fetchAllChildStats(query));
        } else {
            throw new Error('Not implemented');
        }
    }

}