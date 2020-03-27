import { combineReducers } from 'redux';
import collateral from './collateral';
import vaults from './vaults';
import stats from './stats';

const rootReducer = combineReducers({
    collateral,
    vaults,
    stats
});

export default rootReducer;