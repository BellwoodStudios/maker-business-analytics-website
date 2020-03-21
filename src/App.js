import React from 'react';
import 'App.css';
import styled from 'styled-components';
import Logo from 'components/Logo';
import PrimaryNav from 'components/PrimaryNav';
import CollateralMenu from 'components/CollateralMenu';
import Content from 'components/Content';
import { BrowserRouter as Router } from 'react-router-dom';

const Root = styled.div`
    display: grid;
    grid-template-columns: 80px auto;
    grid-template-rows: 64px auto;
    height: 100%;
`;

function App() {
    return (
        <Router>
            <Root>
                <Logo />
                <PrimaryNav />
                <CollateralMenu />
                <Content />
            </Root>
        </Router>
    );
}

export default App;
