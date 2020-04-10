
import { apiReducer } from 'utils/ReduxUtils';
import { getAvailableStats } from 'api';

const FETCH_AVAILABLE_STATS = 'FETCH_AVAILABLE_STATS';

export function fetchAvailableStats ({ collateralName, vaultName }) {
    return {
        type: FETCH_AVAILABLE_STATS,
        promise: getAvailableStats({ collateralName, vaultName })
    };
};

const reducer = apiReducer(FETCH_AVAILABLE_STATS);

export default reducer;