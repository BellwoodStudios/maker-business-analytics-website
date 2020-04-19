import { Query } from 'model';
import { apiInitialState, apiHandle } from 'utils/ReduxUtils';

const SET_ACTIVE_QUERY = 'SET_ACTIVE_QUERY';
const EXECUTE_QUERY = 'EXECUTE_QUERY';

export function setActiveQuery (query) {
    return {
        type: SET_ACTIVE_QUERY,
        query
    };
}

export function executeQuery (query) {
    return {
        type: EXECUTE_QUERY,
        promise: query.execute()
    };
}

const initialState = {
    activeQuery: new Query(),
    activeQueryResult: apiInitialState
};

function reducer (state = initialState, action) {
    switch (action.type) {
        case SET_ACTIVE_QUERY:
            return {
                ...state,
                activeQuery: action.query,
                activeQueryResult: apiInitialState
            };
        case EXECUTE_QUERY:
            return {
                ...state,
                activeQueryResult: apiHandle(state.activeQueryResult, action)
            }
        default:
            return state;
    }
}

export default reducer;