import { handle } from 'redux-pack';

const apiInitialState = {
    loading: false,
    loaded: false,
    payload: null,
    error: null
};

export function apiReducer (actionType) {
    return (state = apiInitialState, action) => {
        const { type, payload } = action;
        switch (type) {
            case actionType:
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
            default:
                return state;
        }
    }
}