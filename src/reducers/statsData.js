
import { apiReducer } from 'utils/ReduxUtils';
import { getStatsData } from 'api';

const FETCH_STATS_DATA = 'FETCH_STATS_DATA';

export function fetchStatsData (stats, { vaultName, collateralName, start, end, granularity }) {
    return {
        type: FETCH_STATS_DATA,
        promise: getStatsData(stats, { vaultName, collateralName, start, end, granularity })
    };
};

const reducer = apiReducer(FETCH_STATS_DATA);

export default reducer;