
import { apiReducer } from 'utils/ReduxUtils';
import { getVaults } from 'api';

const FETCH_VAULTS_BY_COLLATERAL = 'FETCH_VAULTS_BY_COLLATERAL';

export function fetchVaultsByCollateral (collateralName) {
    return {
        type: FETCH_VAULTS_BY_COLLATERAL,
        promise: getVaults({ collateralName })
    };
};

const reducer = apiReducer(FETCH_VAULTS_BY_COLLATERAL);

export default reducer;