
import { apiReducer } from 'utils/ReduxUtils';
import { getAvailableStats } from 'api';

const FETCH_AVAILABLE_STATS = 'FETCH_AVAILABLE_STATS';

export function fetchAvailableStats ({ collateral, vault }) {
    return {
        type: FETCH_AVAILABLE_STATS,
        promise: getAvailableStats({ collateral, vault })
    };
};

const reducer = apiReducer(FETCH_AVAILABLE_STATS);

export default reducer;