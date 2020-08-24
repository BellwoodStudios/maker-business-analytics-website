import moment from 'moment';
import { enumValidValue, arrayEquals } from 'utils';
import { getVaultByName, getCollateralByName, getStats, getStatByName, defaultGlobalStats, defaultVaultStats, fetchGraphQL } from 'api';
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
        // Collateral/vault filtering
        this.collateral = typeof(data.collateral) === 'string' ? getCollateralByName(data.collateral) : data.collateral;
        this.vault = typeof(data.vault) === 'string' ? getVaultByName(data.vault) : data.vault;
        this.type = QueryType.GLOBAL;
        if (this.vault != null) this.type = QueryType.VAULT;
        else if (this.collateral != null) this.type = QueryType.COLLATERAL;

        // What stats to display?
        const apiStats = getStats();
        this.stats = data.stats ?? (this.type === QueryType.GLOBAL ? defaultGlobalStats : defaultVaultStats);
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
        const query = new Query({
            ...this,
            ...data
        });

        if (data.granularity !== this.granularity && data.granularity != null) {
            // Adjust the time range when we adjust granularity as well to prevent loading too many data points by default
            switch (data.granularity) {
                case QueryGranularity.HOUR: data.start = query.end.clone().subtract(3, 'day'); break;
                case QueryGranularity.DAY: data.start = query.end.clone().subtract(3, 'month'); break;
                case QueryGranularity.WEEK: data.start = query.end.clone().subtract(1, 'year'); break;
                case QueryGranularity.MONTH: data.start = query.end.clone().subtract(5, 'year'); break;
                case QueryGranularity.YEAR: data.start = query.end.clone().subtract(10, 'year'); break;
                default: throw new Error('Invalid granularity');
            }

            return new Query({
                ...this,
                ...data
            });
        } else {
            return query;
        }
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
            case QueryType.COLLATERAL: return this.collateral.vaults.some(v => node.ilkId != null ? v.id === node.ilkId : v.identifier === node.ilkIdentifier);
            case QueryType.VAULT: return node.ilkId != null ? this.vault.id === node.ilkId : this.vault.identifier === node.ilkIdentifier;
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
        const granularity = this.granularity === QueryGranularity.WEEK ? `{ days:7 }` : `{ ${this.getMomentGranularity()}s:1 }`;

        // Filter takes the form 's:"2020-01-01", e:"2020-03-01", g:{ days:1 }'
        const endGraphQL = this.end.clone();
        endGraphQL.add(1, 'second').startOf(this.getMomentGranularity());
        return `
            rangeStart: "${this.start.toISOString()}",
            rangeEnd: "${endGraphQL.toISOString()}",
            bucketInterval: ${granularity}
        `;
    }

    /**
     * Fetch an array of headers that mark the time bucket intervals.
     */
    async getBucketedBlockHeaders () {
        const buckets = [];
        const granularity = this.getMomentGranularity();
        let curr = this.start.clone();
        while (curr.isBefore(this.end)) {
            buckets.push({ bucketStart: curr.unix(), bucketEnd:curr.clone().add(1, granularity).unix(), block:null });

            curr.add(1, granularity);
        }
        
        const results = await Query.multiQuery(buckets.map(b => {
            // There is extremely likely at least 1 block every 10 minutes
            // This is just some reasonable lower bound to limit the filter
            const lowerBound = b.bucketEnd - 600;

            return `allHeaders(filter:{ blockTimestamp:{ greaterThanOrEqualTo:"${lowerBound}", lessThan:"${b.bucketEnd}" } }, orderBy:BLOCK_NUMBER_DESC, first:1) {
                nodes {
                    id,
                    blockNumber,
                    blockTimestamp
                }
            }`;
        }));

        for (let i = 0; i < buckets.length; i++) {
            buckets[i].block = results[i].nodes.length > 0 ? results[i].nodes[0] : null;
        }

        return buckets.filter(b => b.block != null);
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
            stats: this.stats.map(s => s.getLongName()),
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

    /**
     * Fire off a bunch of queries at once and get them back in the same order.
     */
    static async multiQuery (queries) {
        const query = queries.map((q, i) => `i${i}: ${q}`).join(",");
        const result = await fetchGraphQL(`{
            ${query}
        }`);

        return queries.map((q, i) => result.data[`i${i}`]);
    }

}