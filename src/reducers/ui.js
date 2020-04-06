import { combineReducers } from 'redux';
import moment from 'moment';

/**
 * Store UI state.
 */

/**
 * ====================== ui.stats ======================
 */

const SET_SHOW_STAT = 'SET_SHOW_STAT';
const SET_ACTIVE_STATS = 'SET_ACTIVE_STATS';

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

export function setActiveStats (activeStats) {
    return {
        type: SET_ACTIVE_STATS,
        activeStats
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
        case SET_ACTIVE_STATS:
            return {
                ...state,
                activeStats: action.activeStats
            };
        default:
            return state;
    }
}

/**
 * ====================== ui.dateRange ======================
 */

const SET_GRANULARITY = 'SET_GRANULARITY';
const SET_DATE_RANGE = 'SET_DATE_RANGE';

/**
 * Set the granularity for the date range.
 */
export function setGranularity (granularity) {
    return {
        type: SET_GRANULARITY,
        granularity
    };
}

/**
 * Set the date range we are looking at.
 */
export function setDateRange (start, end) {
    return {
        type: SET_DATE_RANGE,
        start,
        end
    };
}

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
        case SET_GRANULARITY:
            return {
                ...state,
                granularity: action.granularity
            };
    case SET_DATE_RANGE:
        return {
            ...state,
            start: action.start,
            end: action.end
        };
        default:
            return state;
    }
}

export default combineReducers({
    stats,
    dateRange
});