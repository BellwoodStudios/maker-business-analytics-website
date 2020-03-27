
import { apiReducer } from 'utils/ReduxUtils';
import { getVaults } from 'api';

const FETCH_VAULTS_BY_COLLATERAL = 'FETCH_VAULTS_BY_COLLATERAL';

export function fetchVaultsByCollateral (collateralTickerName) {
    return {
        type: FETCH_VAULTS_BY_COLLATERAL,
        promise: getVaults({ collateral: collateralTickerName })
    };
};

const reducer = apiReducer(FETCH_VAULTS_BY_COLLATERAL);

export default reducer;