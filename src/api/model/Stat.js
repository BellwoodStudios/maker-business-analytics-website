import { enumValidValue } from 'utils';
import { QueryType } from 'model';

export const StatTypes = {
    NUMBER: 'number',
    PERCENT: 'percent'
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
    REPLACE: 'replace',
    // Sum all the values together
    // Used for stats like Dai Supply where all the values contribute to say the daily total for example
    SUM: 'sum'
};

/**
    Use these colors for stats and mark them off when they are used:

    #1AAB9B - Stability Fee
    #F4B731 - Base Fee
    #00E676 - Vault Fee
    #FF7043 - New Vaults
    #26C6DA - Dai Savings Rate
    #448AFF
    #7E57C2
    #E040FB
    #FF4081
    #FF5252
    #9CCC65
    #5C6BC0
    #89A74D
    #B584FF
    #83D17E
    #3FDFC9
    #FFA143
    #4AC9F1
    #567FEE
    #7E57C2
    #FA65FF
    #FF658F
    #FF5D51
    #ABEB63
    #8287FF
    #89A74D
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
        this.type = data.type ?? StatTypes.NUMBER;
        this.targets = data.targets ?? StatTargets.ALL;
        this.aggregation = data.aggregation ?? StatAggregations.REPLACE;
        this.stats = data.stats ?? [];

        enumValidValue(StatTypes, 'type', this.type);
        enumValidValue(StatAggregations, 'aggregation', this.aggregation);
    }

    /**
     * Returns true iff the stat is available for the provided query.
     */
    isAvailableForQuery (query) {
        switch (query.type) {
            case QueryType.GLOBAL:
                return (this.targets & StatTargets.GLOBAL) !== 0;
            case QueryType.COLLATERAL:
                return (this.targets & StatTargets.COLLATERAL) !== 0;
            case QueryType.VAULT:
                return (this.targets & StatTargets.VAULT) !== 0;
            default:
                return false;
        }
    }

    /**
     * Fetch all the child stats and combine them into a flattened, ordered StatDataItem array.
     */
    async fetchAllChildStats (query) {
        const combined = (await Promise.all(this.stats.map(s => s.fetch(query)))).flatMap(sd => sd.data);
        combined.sort((a, b) => a.block.number < b.block.number ? -1 : 1);
        return combined;
    }

    /**
     * Fetch stat data given the query. This is abstract and needs a subclass implementation.
     */
    async fetch (query) {
        throw new Error('Not implemented');
    }

}