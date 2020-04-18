import moment from 'moment';
import { enumValidValue } from 'utils';
import { getVaultByName, getCollateralByName } from 'api';

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
        this.stats = data.stats ?? [];
        this.collateral = data.collateral;
        this.vault = data.vault;
        this.type = QueryType.GLOBAL;
        if (this.vault != null) this.type = QueryType.VAULT;
        else if (this.collateral != null) this.type = QueryType.COLLATERAL;
        this.start = data.start ?? moment().startOf('month');
        this.end = data.end ?? moment().startOf('day');
        this.granularity = data.granularity ?? QueryGranularity.DAY;

        enumValidValue(QueryGranularity, 'granularity', this.granularity);
    }

    clone (data) {
        return new Query({
            ...this,
            ...data
        });
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

    /**
     * Build the filter query from useParams().
     */
    static createFromParams (params) {
        const { vaultName, collateralName } = params;
        const vault = getVaultByName(vaultName);
        const collateral = getCollateralByName(collateralName);

        return new Query({
            vault,
            collateral
        });
    }

}