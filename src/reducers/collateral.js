import { apiReducer } from 'utils/ReduxUtils';
import { fetchCollateral } from 'api';

const FETCH_COLLATERAL = 'FETCH_COLLATERAL';

export function loadCollateral () {
    return {
        type: FETCH_COLLATERAL,
        promise: fetchCollateral()
    };
};

const reducer = apiReducer(FETCH_COLLATERAL);

export default reducer;