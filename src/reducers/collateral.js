import { timeout } from 'utils/AsyncUtils';

// Constants ----------------------------------------------

export const FETCH_COLLATERAL_PENDING = 'FETCH_COLLATERAL_PENDING';
export const FETCH_COLLATERAL_SUCCESS = 'FETCH_COLLATERAL_SUCCESS';
export const FETCH_COLLATERAL_ERROR = 'FETCH_COLLATERAL_ERROR';

export function fetchCollateralPending () {
    return {
        type: FETCH_COLLATERAL_PENDING
    }
}

export function fetchCollateralSuccess (collateralTypes) {
    return {
        type: FETCH_COLLATERAL_SUCCESS,
        collateralTypes
    }
}

export function fetchCollateralError (error) {
    return {
        type: FETCH_COLLATERAL_ERROR,
        error
    }
}

// Actions ----------------------------------------------

export function fetchCollateral () {
    return async dispatch => {
        dispatch(fetchCollateralPending());
        await timeout(1000);
        dispatch(fetchCollateralSuccess([
            { name:"Ethereum", ticker:"ETH" },
            { name:"Basic Attention Token", ticker:"BAT" },
            { name:"USDC", ticker:"USDC" }
        ]));
        // TODO - switch from mock api
        /*fetch('https://exampleapi.com/products')
            .then(res => res.json())
            .then(res => {
                if(res.error) {
                    throw(res.error);
                }
                dispatch(fetchCollateralSuccess(res.collateral));
                return res.collateral;
            })
            .catch(error => {
                dispatch(fetchCollateralError(error));
            });*/
    }
}

// Reducer ----------------------------------------------

const initialState = {
    loading: false,
    types: [],
    error: null
};

export function collateral (state = initialState, action) {
    switch(action.type) {
        case FETCH_COLLATERAL_PENDING: 
            return {
                ...state,
                loading: true
            }
        case FETCH_COLLATERAL_SUCCESS:
            return {
                ...state,
                loading: false,
                types: action.collateralTypes
            }
        case FETCH_COLLATERAL_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error
            }
        default: 
            return state;
    }
}

export default collateral;