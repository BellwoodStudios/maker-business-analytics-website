import { handle } from 'redux-pack';

/**
 * Initial state for all API queries.
 */
export const apiInitialState = {
    loading: false,
    loaded: false,
    payload: null,
    error: null
};

/**
 * Handle API requests in the standard way.
 */
export function apiHandle (state, action) {
    const { payload } = action;
    return handle(state, action, {
        start: prevState => ({
            ...prevState,
            loading: true,
            loaded: false,
            payload: null,
            error: null
        }),
        finish: prevState => ({ ...prevState, loading:false, loaded: true }),
        failure: prevState => ({ ...prevState, error: payload }),
        success: prevState => ({ ...prevState, payload: payload })
    });
}

/**
 * Single API action reducer.
 */
export function apiReducer (actionType) {
    return (state = apiInitialState, action) => {
        const { type } = action;
        switch (type) {
            case actionType:
                return apiHandle(state, action);
            default:
                return state;
        }
    }
}