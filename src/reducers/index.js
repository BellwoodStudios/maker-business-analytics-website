import { combineReducers } from 'redux';
import collateral from './collateral';
import vaults from './vaults';
import stats from './stats';
import ui from './ui';

const rootReducer = combineReducers({
    collateral,
    vaults,
    stats,
    ui
});

export default rootReducer;