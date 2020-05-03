import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { init } from 'api';
import createRootReducer from 'reducers';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { middleware as reduxPackMiddleware } from 'redux-pack';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { ConnectedRouter as Router, routerMiddleware } from 'connected-react-router';

const history = createBrowserHistory();

const store = createStore(createRootReducer(history), applyMiddleware(
    thunk,
    reduxPackMiddleware,
    routerMiddleware(history)
));

(async () => {
    try {
        await init();    
    } catch (err) {
        // TODO add API unavailable some failure message in html instead of an alert
        alert(`Failed to connect to data endpoint.\n\n${err}`);
    }

    ReactDOM.render(
        <Provider store={store}>
            <Router history={history}>
                <App />
            </Router>
        </Provider>,
        document.getElementById('root'));

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.unregister();
})();
