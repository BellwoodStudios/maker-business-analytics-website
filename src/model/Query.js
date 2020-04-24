import moment from 'moment';
import { enumValidValue, arrayEquals } from 'utils';
import { getVaultByName, getCollateralByName, getStats } from 'api';
import { StatData } from 'api/model';

export const QueryType = {
    GLOBAL: 'Global',
    COLLATERAL: 'Collateral',
    VAULT: 'Vault'
};

export const QueryGranularity = {
    HOUR: 'Hourly',
    DAY: 'Daily',
    WEEK: 'Weekly',
    MONTH: 'Monthly',
    YEAR: 'Yearly'
};

/**
 * A query is a set of parameters that completely represents a data view inside this app.
 * 
 * Query is immutable. All changes should be applied to a new query.
 */
export default class Query {

    constructor (data = {}) {
        this.stats = data.stats ?? getStats();
        this.collateral = typeof(data.collateral) === 'string' ? getCollateralByName(data.collateral) : data.collateral;
        this.vault = typeof(data.vault) === 'string' ? getVaultByName(data.vault) : data.vault;
        this.type = QueryType.GLOBAL;
        if (this.vault != null) this.type = QueryType.VAULT;
        else if (this.collateral != null) this.type = QueryType.COLLATERAL;
        this.start = data.start ?? moment().subtract(3, 'month');
        this.end = data.end ?? moment();
        this.granularity = data.granularity ?? QueryGranularity.DAY;

        enumValidValue(QueryGranularity, 'granularity', this.granularity);
    }

    clone (data) {
        return new Query({
            ...this,
            ...data
        });
    }

    equals (q) {
        return arrayEquals(this.stats, q.stats) &&
            this.collateral === q.collateral &&
            this.vault === q.vault &&
            this.start === q.start &&
            this.end === q.end &&
            this.granularity === q.granularity;
    }

    /**
     * Filter stats down to those which are currently active.
     */
    filterActiveStats (stats) {
        return stats.filter(s => this.stats.includes(s));
    }

    /**
     * Returns a new query with the provided stat set to be active or not.
     */
    setStatActive (stat, active) {
        return this.clone({
            stats: this.stats.filter(s => s !== stat).concat(active ? [stat] : [])
        });
    }

    /**
     * Filter a given node by query type.
     */
    filterByIlk (node) {
        switch (this.type) {
            case QueryType.GLOBAL: return true;
            case QueryType.COLLATERAL: return this.collateral.vaults.any(v => v.id === node.ilkId);
            case QueryType.VAULT: return this.vault.id === node.ilkId;
            default: return false;
        }
    }

    /**
     * Execute the query and return the data.
     */
    async execute () {
        const results = await Promise.all(this.stats.filter(s => s.isAvailableForQuery(this)).map(s => s.fetch(this)));
        // Do a sanity check to verify the result is in a proper format
        for (const result of results) {
            if (!(result instanceof StatData)) {
                throw new Error("Stat is not returning type 'StatData'.");
            }

            result.pack(this);
        }
        return results;
    }

    /**
     * Build a full url from the state.
     */
    toUrl () {
        let url = window.location.origin;

        switch (this.type) {
            case QueryType.COLLATERAL: url += `/vaults/${this.collateral.name}`; break;
            case QueryType.VAULT: url += `/vaults/${this.collateral.name}/${this.vault.name}`; break;
            default: url += '/'; break;
        }
        const params = {
            stats: this.stats.map(s => s.name),
            start: this.start,
            end: this.end,
            granularity: this.granularity
        };
        url += "?" + Object.keys(params).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join("&");

        return url;
    }

}