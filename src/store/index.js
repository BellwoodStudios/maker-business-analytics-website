import { combineReducers } from 'redux';
import collateral from './collateral';
import vaults from './vaults';

const rootReducer = combineReducers({
    collateral,
    vaults
});

export default rootReducer;