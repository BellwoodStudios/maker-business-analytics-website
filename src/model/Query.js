import moment from 'moment';
import { enumValidValue, arrayEquals } from 'utils';
import { getVaultByName, getCollateralByName, getStats, getStatByName } from 'api';
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
        // What stats to display?
        const apiStats = getStats();
        this.stats = data.stats ?? apiStats;
        if (typeof(this.stats) === 'string') this.stats = this.stats.split(",");
        this.stats = this.stats.map(s => {
            if (typeof s === 'string') {
                return getStatByName(s);
            } else {
                return s;
            }
        }).filter(s => s != null);

        // Enforce the active stat ordering of what's defined in the api otherwise the Chart will not align with the data
        this.stats.sort((a, b) => apiStats.indexOf(a) < apiStats.indexOf(b) ? -1 : 1);

        // Collateral/vault filtering
        this.collateral = typeof(data.collateral) === 'string' ? getCollateralByName(data.collateral) : data.collateral;
        this.vault = typeof(data.vault) === 'string' ? getVaultByName(data.vault) : data.vault;
        this.type = QueryType.GLOBAL;
        if (this.vault != null) this.type = QueryType.VAULT;
        else if (this.collateral != null) this.type = QueryType.COLLATERAL;

        // Date range and granularity
        this.granularity = data.granularity ?? QueryGranularity.DAY;
        this.end = data.end ?? moment();
        if (typeof(this.end) === 'string') this.end = moment.unix(this.end);
        this.end = this.end.endOf(this.getMomentGranularity());
        this.start = data.start ?? this.end.clone().subtract(3, 'month');
        if (typeof(this.start) === 'string') this.start = moment.unix(this.start);
        this.start = this.start.startOf(this.getMomentGranularity());

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
            this.start.isSame(q.start) &&
            this.end.isSame(q.end) &&
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
            case QueryType.COLLATERAL: return this.collateral.vaults.some(v => v.id === node.ilkId);
            case QueryType.VAULT: return this.vault.id === node.ilkId;
            default: return false;
        }
    }

    getMomentGranularity () {
        switch (this.granularity) {
            case QueryGranularity.HOUR: return "hour";
            case QueryGranularity.DAY: return "day";
            case QueryGranularity.WEEK: return "week";
            case QueryGranularity.MONTH: return "month";
            case QueryGranularity.YEAR: return "year";
            default: throw new Error('Invalid granularity');
        }
    }

    /**
     * Returns a standard graphql filter which sets a start, end and granularity.
     */
    toGraphQLFilter () {
        const granularity = `{ ${this.getMomentGranularity()}s:1 }`;

        // Filter takes the form 's:"2020-01-01", e:"2020-03-01", g:{ days:1 }'
        return `
            s: "${this.start.toISOString()}",
            e: "${this.end.toISOString()}",
            g: ${granularity}
        `;
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
        let url = "";

        switch (this.type) {
            case QueryType.COLLATERAL: url += `/vaults/${this.collateral.name}`; break;
            case QueryType.VAULT: url += `/vaults/${this.collateral.name}/${this.vault.name}`; break;
            default: url += '/'; break;
        }
        const params = {
            stats: this.stats.map(s => s.name),
            start: this.start.unix(),
            end: this.end.unix(),
            granularity: this.granularity
        };
        url += "?" + Object.keys(params).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join("&");

        return url;
    }

    static fromParams (params) {
        return new Query({
            stats: params.stats,
            collateral: params.collateralName,
            vault: params.vaultName,
            start: params.start,
            end: params.end,
            granularity: params.granularity
        });
    }

}