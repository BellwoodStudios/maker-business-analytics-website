
import { timeout } from 'utils/AsyncUtils';

// Constants ----------------------------------------------

export const FETCH_VAULTS_PENDING = 'FETCH_VAULTS_PENDING';
export const FETCH_VAULTS_SUCCESS = 'FETCH_VAULTS_SUCCESS';
export const FETCH_VAULTS_ERROR = 'FETCH_VAULTS_ERROR';

export function fetchVaultsPending () {
    return {
        type: FETCH_VAULTS_PENDING
    }
}

export function fetchVaultsSuccess (vaults) {
    return {
        type: FETCH_VAULTS_SUCCESS,
        vaults
    }
}

export function fetchVaultsError (error) {
    return {
        type: FETCH_VAULTS_ERROR,
        error
    }
}

// Actions ----------------------------------------------

export function fetchVaultsByCollateral (collateralTickerName) {
    return async dispatch => {
        dispatch(fetchVaultsPending());
        await timeout(1000);

        // TODO switch from mock api
        const lookup = {
            'ETH': [
                {
                    name: "ETH-A",
                    collateral: "ETH",
                    daiIssued: 1280000000
                },
                {
                    name: "ETH-B",
                    collateral: "ETH",
                    daiIssued: 370000000
                },
                {
                    name: "ETH-C",
                    collateral: "ETH",
                    daiIssued: 34563
                },
                {
                    name: "ETH-D",
                    collateral: "ETH",
                    daiIssued: 3834563
                }
            ],
            'BAT': [
                {
                    name: "BAT-A",
                    collateral: "BAT",
                    daiIssued: 300000
                }
            ],
            'USDC': [
                {
                    name: "USDC-A",
                    collateral: "USDC",
                    daiIssued: 6234723
                }
            ]
        };

        dispatch(fetchVaultsSuccess(lookup[collateralTickerName]));
    }
}

// Reducer ----------------------------------------------

const initialState = {
    loading: false,
    vaults: [],
    error: null
};

export function vaults (state = initialState, action) {
    switch(action.type) {
        case FETCH_VAULTS_PENDING: 
            return {
                ...state,
                loading: true
            }
        case FETCH_VAULTS_SUCCESS:
            return {
                ...state,
                loading: false,
                vaults: action.vaults
            }
        case FETCH_VAULTS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error
            }
        default: 
            return state;
    }
}

export default vaults;