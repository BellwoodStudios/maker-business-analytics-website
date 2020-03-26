import React from 'react';
import 'App.css';
import styled from 'styled-components';
import Logo from 'components/Logo';
import PrimaryNav from 'components/PrimaryNav';
import CollateralMenu from 'components/CollateralMenu';
import Content from 'components/Content';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import rootReducer from 'reducers';
import { createStore } from 'redux';

const store = createStore(rootReducer);

const Root = styled.div`
    display: grid;
    grid-template-columns: 80px auto;
    grid-template-rows: 64px auto;
    height: 100%;
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
