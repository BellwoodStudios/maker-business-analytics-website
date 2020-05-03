import { Query } from 'model';
import { apiInitialState, apiHandle } from 'utils/ReduxUtils';
import { push } from 'connected-react-router';

const SET_ACTIVE_QUERY = 'SET_ACTIVE_QUERY';
const EXECUTE_QUERY = 'EXECUTE_QUERY';

export const setActiveQuery = (query) => (dispatch) => {
    dispatch(push(query.toUrl()));
    dispatch({
        type: SET_ACTIVE_QUERY,
        query
    });
    dispatch({
        type: EXECUTE_QUERY,
        query,
        promise: query.execute()
    });
}

const initialState = {
    activeQuery: new Query(),
    results: {}
};

function reducer (state = initialState, action) {
    switch (action.type) {
        case SET_ACTIVE_QUERY:
            return {
                ...state,
                activeQuery: action.query
            };
        case EXECUTE_QUERY:
            const key = state.activeQuery.toUrl();
            if (state.results[key] == null || state.results[key].loading) {
                // Need to fetch the data
                return {
                    ...state,
                    results: {
                        ...state.results,
                        [key]: apiHandle(apiInitialState, action)
                    }
                }
            } else {
                // Already loaded
                return state;
            }
        default:
            return state;
    }
}

export default reducer;