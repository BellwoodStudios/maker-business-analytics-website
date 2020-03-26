
import { apiReducer } from 'utils/ReduxUtils';
import { fetchVaultsByCollateral } from 'api';

const FETCH_VAULTS_BY_COLLATERAL = 'FETCH_VAULTS_BY_COLLATERAL';

export function loadVaultsByCollateral (collateralTickerName) {
    return {
        type: FETCH_VAULTS_BY_COLLATERAL,
        promise: fetchVaultsByCollateral(collateralTickerName)
    };
};

const reducer = apiReducer(FETCH_VAULTS_BY_COLLATERAL);

export default reducer;