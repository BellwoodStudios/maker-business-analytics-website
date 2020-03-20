import React from 'react';
import 'App.css';
import styled from 'styled-components';
import Logo from 'components/Logo';
import PrimaryNav from 'components/PrimaryNav';
import CollateralMenu from 'components/CollateralMenu';
import Content from 'components/Content';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

const Root = styled.div`
  display: grid;
  grid-template-columns: 80px auto;
  grid-template-rows: 64px auto;
  height: 100%;
`;

function App() {
    return (
        <Router history={createBrowserHistory()}>
            <Root>
                <Logo />
                <PrimaryNav />
                <CollateralMenu>CT Menu</CollateralMenu>
                <Content>Content</Content>
            </Root>
        </Router>
    );
}

export default App;
