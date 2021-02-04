import { Stat, StatTypes, StatTargets, Bucket, StatData, StatDataItem } from 'api/model';
import { fromWad } from 'utils/MathUtils';
import { getVaults } from 'api';
import { transpose, arraySum } from 'utils';
import { Query } from 'model';

/**
 * Fetch time series on all the high-level ilk stats. Not to be used directly, but instead as a common stat dependency.
 */
export default class FrobStat extends Stat {

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
        if (vd.count == null) vd.count = 0;
        if (vd.dink == null) vd.dink = 0;
        if (vd.dart == null) vd.dart = 0;
        if (vd.lock == null) vd.lock = 0;
        if (vd.free == null) vd.free = 0;
        if (vd.draw == null) vd.draw = 0;
        if (vd.wipe == null) vd.wipe = 0;
        vd.count = arraySum(values, v => v.extraData.count);
        vd.dink = arraySum(values, v => v.extraData.dink);
        vd.dart = arraySum(values, v => v.extraData.dart);
        vd.lock = arraySum(values, v => v.extraData.lock);
        vd.free = arraySum(values, v => v.extraData.free);
        vd.draw = arraySum(values, v => v.extraData.draw);
        vd.wipe = arraySum(values, v => v.extraData.wipe);
        return value;
    }

    async fetch (query) {
        // Fetch all ilks in advance
        const args = query.toGraphQLFilter();
        const vaults = getVaults();
        const results = await Query.multiQuery(vaults.map(v => {
            return `
                timeFrobTotals(first:1000, ilkIdentifier:"${v.identifier}", ${args}) {
                    nodes {
                        bucketStart,
                        bucketEnd,
                        count,
                        dink,
                        dart,
                        lock,
                        free,
                        draw,
                        wipe
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
        const statDatas = results.map(d => {
            return d.nodes.filter(n => n != null && query.filterByIlk(n)).map(n => {
                return new StatDataItem({
                    bucket: new Bucket(n),
                    value: 1,
                    extraData: {
                        count: parseInt(n.count),
                        dink: fromWad(n.dink),
                        dart: fromWad(n.dart),
                        lock: fromWad(n.lock),
                        free: fromWad(n.free),
                        draw: fromWad(n.draw),
                        wipe: fromWad(n.wipe)
                    }
                });
            });
        }).filter(d => d.length > 0).map(d => new StatData({ stat:this, data:d }));
        for (const sd of statDatas) {
            await sd.pack(query);
        }

        // Combine them across ilks
        const mergedData = transpose(statDatas.map(d => d.data)).map(row => row.reduce((val, curr) => {
            const vd = val.extraData;
            const cd = curr.extraData;

            if (vd.count == null) vd.count = 0;
            if (vd.dink == null) vd.dink = 0;
            if (vd.dart == null) vd.dart = 0;
            if (vd.lock == null) vd.lock = 0;
            if (vd.free == null) vd.free = 0;
            if (vd.draw == null) vd.draw = 0;
            if (vd.wipe == null) vd.wipe = 0;

            vd.count += cd.count ?? 0;
            vd.dink += cd.dink ?? 0;
            vd.dart += cd.dart ?? 0;
            vd.lock += cd.lock ?? 0;
            vd.free += cd.free ?? 0;
            vd.draw += cd.draw ?? 0;
            vd.wipe += cd.wipe ?? 0;
            
            return val;
        }));

        return new StatData({
            stat: this,
            data: mergedData
        });
    }

}