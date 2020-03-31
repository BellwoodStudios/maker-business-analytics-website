import { combineReducers } from 'redux';
import moment from 'moment';

/**
 * Store UI state.
 */

/**
 * ====================== ui.stats ======================
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

const statsInitialState = {
    activeStats: [
        "Dai Supply",
        "Stability Fee"
    ]
};

function stats (state = statsInitialState, action) {
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

/**
 * ====================== ui.dateRange ======================
 */

const dateRangeInitialState = {
    start: moment().startOf('month'),
    end: moment().startOf('day'),
    granularity: "day",
    granularityOptions: [
        {
            name: "hour",
            label: "Hourly"
        },
        {
            name: "day",
            label: "Daily"
        },
        {
            name: "week",
            label: "Weekly"
        },
        {
            name: "month",
            label: "Monthly"
        },
        {
            name: "year",
            label: "Yearly"
        }
    ]
};

function dateRange (state = dateRangeInitialState, action) {
    switch (action.type) {
        default:
            return state;
    }
}

export default combineReducers({
    stats,
    dateRange
});