import { apiReducer } from 'utils/ReduxUtils';
import { getCollateral } from 'api';

const FETCH_COLLATERAL = 'FETCH_COLLATERAL';

export function fetchCollateral () {
    return {
        type: FETCH_COLLATERAL,
        promise: getCollateral()
    };
};

const reducer = apiReducer(FETCH_COLLATERAL);

export default reducer;