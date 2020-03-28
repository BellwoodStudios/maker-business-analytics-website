import { combineReducers } from 'redux';

/**
 * Store UI state.
 */

const SET_SHOW_STAT = 'SET_SHOW_STAT';

/**
 * Show or hide a stat. Stat should just be the string name.
 */
export function setStatActive (stat, active) {
    return {
        type: SET_SHOW_STAT,
        stat,
        active
    };
}

const initialState = {
    activeStats: [
        "Dai Supply",
        "Stability Fee"
    ]
};

function stats (state = initialState, action) {
    switch (action.type) {
        case SET_SHOW_STAT:
            return {
                ...state,
                activeStats: action.active ? state.activeStats.filter(s => s !== action.stat).concat([action.stat]) : state.activeStats.filter(s => s !== action.stat)
            };
        default:
            return state;
    }
}

export default combineReducers({
    stats
});