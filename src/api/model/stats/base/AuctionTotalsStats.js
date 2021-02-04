import { Stat, StatTypes, StatTargets, Bucket, StatData, StatDataItem } from 'api/model';
import { fetchGraphQL, getVaults } from 'api';
import { arraySum, transpose } from 'utils';
import { fromRad, fromWad } from 'utils/MathUtils';
import { Query } from 'model';

/**
 * Fetch time series on all the high-level bite stats. Not to be used directly, but instead as a common stat dependency.
 */
export class BiteTotalsStat extends Stat {

    constructor () {
        super({
            type: StatTypes.EVENT,
            targets: StatTargets.ALL
        });
    }

    combineTime (bucket, values) {
        // Sum up all the values because they are total amounts per time period
        const value = values[values.length - 1];
        const vd = value.extraData;
        vd.count = arraySum(values, v => v.extraData.count);
        vd.ink = arraySum(values, v => v.extraData.ink);
        vd.art = arraySum(values, v => v.extraData.art);
        vd.tab = arraySum(values, v => v.extraData.tab);
        return value;
    }

    async fetch (query) {
        // Fetch all ilks in advance
        const args = query.toGraphQLFilter();
        const vaults = getVaults();
        const results = await Query.multiQuery(vaults.map(v => {
            return `
                timeBiteTotals(first:1000, ilkIdentifier:"${v.identifier}", ${args}) {
                    nodes {
                        bucketStart,
                        bucketEnd,
                        count,
                        ink,
                        art,
                        tab
                    }
                }
            `;
        }));

        // Attach on the ilkIdentifier for filtering
        for (let i = 0; i < results.length; i++) {
            for (const n of results[i].nodes) {
                n.ilkIdentifier = vaults[i].identifier;
            }
        }

        // Parse each ilk that fits the filter
        const data = results.map(d => {
            return d.nodes.filter(n => n != null && query.filterByIlk(n)).map(n => {
                return new StatDataItem({
                    bucket: new Bucket(n),
                    value: 1,
                    extraData: {
                        count: parseInt(n.count),
                        ink: fromWad(n.ink),
                        art: fromRad(n.art),
                        tab: fromRad(n.tab)
                    }
                });
            });
        }).filter(d => d.length > 0);

        // Pad out any results which are too small
        data.sort((a, b) => a.length < b.length ? 1 : -1);
        for (let i = 1; i < data.length; i++) {
            while (data[i].length < data[0].length) {
                data[i].unshift(null);
            }
        }

        // Combine them across ilks
        const mergedData = transpose(data).map(row => row.reduce((val, curr) => {
            if (curr == null) return val;

            const vd = val.extraData;
            const cd = curr.extraData;

            vd.count += cd.count;
            vd.ink += cd.ink;
            vd.art += cd.art;
            vd.tab += cd.tab;
            
            return val;
        }));

        return new StatData({
            stat: this,
            data: mergedData
        });
    }

}

/**
 * Fetch time series on all the high-level flip stats. Not to be used directly, but instead as a common stat dependency.
 */
export class FlipBidTotalsStat extends Stat {

    constructor () {
        super({
            type: StatTypes.EVENT,
            targets: StatTargets.ALL
        });
    }

    combineTime (bucket, values) {
        // Sum up all the values because they are total amounts per time period
        const value = values[values.length - 1];
        const vd = value.extraData;
        vd.count = arraySum(values, v => v.extraData.count);
        vd.lotStart = arraySum(values, v => v.extraData.lotStart);
        vd.lotEnd = arraySum(values, v => v.extraData.lotEnd);
        vd.bidAmountStart = arraySum(values, v => v.extraData.bidAmountStart);
        vd.bidAmountEnd = arraySum(values, v => v.extraData.bidAmountEnd);
        return value;
    }

    async fetch (query) {
        // Fetch all ilks in advance
        const args = query.toGraphQLFilter();
        const vaults = getVaults();
        const results = await Query.multiQuery(vaults.map(v => {
            return `
                timeFlipBidTotals(first:1000, ilkIdentifier:"${v.identifier}", ${args}) {
                    nodes {
                        bucketStart,
                        bucketEnd,
                        count,
                        lotStart,
                        lotEnd,
                        bidAmountStart,
                        bidAmountEnd
                    }
                }
            `;
        }));

        // Attach on the ilkIdentifier for filtering
        for (let i = 0; i < results.length; i++) {
            for (const n of results[i].nodes) {
                n.ilkIdentifier = vaults[i].identifier;
            }
        }

        // Parse each ilk that fits the filter
        const data = results.map(d => {
            return d.nodes.filter(n => n != null && query.filterByIlk(n)).map(n => {
                return new StatDataItem({
                    bucket: new Bucket(n),
                    value: 1,
                    extraData: {
                        count: parseInt(n.count),
                        lotStart: fromWad(n.lotStart),
                        lotEnd: fromWad(n.lotEnd),
                        bidAmountStart: fromRad(n.bidAmountStart),
                        bidAmountEnd: fromRad(n.bidAmountEnd),
                    }
                });
            });
        }).filter(d => d.length > 0);

        // Pad out any results which are too small
        data.sort((a, b) => a.length < b.length ? 1 : -1);
        for (let i = 1; i < data.length; i++) {
            while (data[i].length < data[0].length) {
                data[i].unshift(null);
            }
        }

        // Combine them across ilks
        const mergedData = transpose(data).map(row => row.reduce((val, curr) => {
            if (curr == null) return val;

            const vd = val.extraData;
            const cd = curr.extraData;

            vd.count += cd.count;
            vd.lotStart += cd.lotStart;
            vd.lotEnd += cd.lotEnd;
            vd.bidAmountStart += cd.bidAmountStart;
            vd.bidAmountEnd += cd.bidAmountEnd;
            
            return val;
        }));

        return new StatData({
            stat: this,
            data: mergedData
        });
    }

}

/**
 * Fetch time series on all the high-level flop stats. Not to be used directly, but instead as a common stat dependency.
 */
export class FlopBidTotalsStat extends Stat {

    constructor () {
        super({
            type: StatTypes.EVENT,
            targets: StatTargets.ALL
        });
    }

    combineTime (bucket, values) {
        // Sum up all the values because they are total amounts per time period
        const value = values[values.length - 1];
        const vd = value.extraData;
        vd.count = arraySum(values, v => v.extraData.count);
        vd.lotStart = arraySum(values, v => v.extraData.lotStart);
        vd.lotEnd = arraySum(values, v => v.extraData.lotEnd);
        vd.bidAmountStart = arraySum(values, v => v.extraData.bidAmountStart);
        vd.bidAmountEnd = arraySum(values, v => v.extraData.bidAmountEnd);
        return value;
    }

    async fetch (query) {
        // Fetch all ilks in advance
        const args = query.toGraphQLFilter();
        const result = await fetchGraphQL(`
            {
                timeFlopBidTotals(first:1000, ${args}) {
                    nodes {
                        bucketStart,
                        bucketEnd,
                        count,
                        lotStart,
                        lotEnd,
                        bidAmountStart,
                        bidAmountEnd
                    }
                }
            }
        `);

        const data = result.data.timeFlopBidTotals.nodes.map(n => {
            return new StatDataItem({
                bucket: new Bucket(n),
                value: 1,
                extraData: {
                    count: parseInt(n.count),
                    lotStart: fromWad(n.lotStart),
                    lotEnd: fromWad(n.lotEnd),
                    bidAmountStart: fromRad(n.bidAmountStart),
                    bidAmountEnd: fromRad(n.bidAmountEnd),
                }
            });
        });

        return new StatData({
            stat: this,
            data: data
        });
    }

}

/**
 * Fetch time series on all the high-level flap stats. Not to be used directly, but instead as a common stat dependency.
 */
export class FlapBidTotalsStat extends Stat {

    constructor () {
        super({
            type: StatTypes.EVENT,
            targets: StatTargets.ALL
        });
    }

    combineTime (bucket, values) {
        // Sum up all the values because they are total amounts per time period
        const value = values[values.length - 1];
        const vd = value.extraData;
        vd.count = arraySum(values, v => v.extraData.count);
        vd.lotStart = arraySum(values, v => v.extraData.lotStart);
        vd.lotEnd = arraySum(values, v => v.extraData.lotEnd);
        vd.bidAmountStart = arraySum(values, v => v.extraData.bidAmountStart);
        vd.bidAmountEnd = arraySum(values, v => v.extraData.bidAmountEnd);
        return value;
    }

    async fetch (query) {
        const args = query.toGraphQLFilter();

        const result = await fetchGraphQL(`
            {
                timeFlapBidTotals(first:1000, ${args}) {
                    nodes {
                        bucketStart,
                        bucketEnd,
                        count,
                        lotStart,
                        lotEnd,
                        bidAmountStart,
                        bidAmountEnd
                    }
                }
            }
        `);

        const data = result.data.timeFlapBidTotals.nodes.map(n => {
            return new StatDataItem({
                bucket: new Bucket(n),
                value: 1,
                extraData: {
                    count: parseInt(n.count),
                    lotStart: fromRad(n.lotStart),
                    lotEnd: fromRad(n.lotEnd),
                    bidAmountStart: fromWad(n.bidAmountStart),
                    bidAmountEnd: fromWad(n.bidAmountEnd),
                }
            });
        });

        return new StatData({
            stat: this,
            data: data
        });
    }

}