import { combineReducers } from 'redux';
import collateral from './collateral';
import vaults from './vaults';
import stats from './stats';
import statsData from './statsData';
import ui from './ui';

const rootReducer = combineReducers({
    collateral,
    vaults,
    stats,
    statsData,
    ui
});

export default rootReducer;