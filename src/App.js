import React from 'react';
import styled from 'styled-components';
import Logo from 'components/Logo';
import PrimaryNav from 'components/PrimaryNav';
import CollateralMenu from 'components/CollateralMenu';
import Content from 'components/Content';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import rootReducer from 'reducers';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { middleware as reduxPackMiddleware } from 'redux-pack';
import logger from 'redux-logger';

const store = createStore(rootReducer, applyMiddleware(
    thunk,
    reduxPackMiddleware,
    logger
));

const Root = styled.div`
    display: grid;
    grid-template-columns: 80px auto;
    grid-template-rows: 64px auto;
    min-height: 100vh;
`;

function App() {
    return (
        <Provider store={store}>
            <Router>
                <Root>
                    <Logo />
                    <PrimaryNav />
                    <CollateralMenu />
                    <Content />
                </Root>
            </Router>
        </Provider>
    );
}

export default App;
