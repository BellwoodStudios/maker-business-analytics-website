import { combineReducers } from 'redux';
import query from './query';
import { connectRouter } from 'connected-react-router';

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    query
});

export default createRootReducer;