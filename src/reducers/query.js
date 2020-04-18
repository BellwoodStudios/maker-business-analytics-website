import { Query } from 'model';

const SET_ACTIVE_QUERY = 'SET_ACTIVE_QUERY';

/**
 * Set the active query.
 */
export function setActiveQuery (query) {
    return {
        type: SET_ACTIVE_QUERY,
        query
    };
}

const initialState = {
    activeQuery: new Query()
};

function reducer (state = initialState, action) {
    switch (action.type) {
        case SET_ACTIVE_QUERY:
            return {
                ...state,
                activeQuery: action.query
            };
        default:
            return state;
    }
}

export default reducer;