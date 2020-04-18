import { combineReducers } from 'redux';
import statsData from './statsData';
import query from './query';

const rootReducer = combineReducers({
    query,
    statsData
});

export default rootReducer;