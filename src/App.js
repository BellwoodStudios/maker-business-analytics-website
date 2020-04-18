import React from 'react';
import styled from 'styled-components';
import Logo from 'components/Logo';
import PrimaryNav from 'components/PrimaryNav';
import CollateralMenu from 'components/CollateralMenu';
import Content from 'components/Content';

const Root = styled.div`
    display: grid;
    grid-template-columns: 80px auto;
    grid-template-rows: 64px auto;
    min-height: 100vh;
`;

function App() {
    return (
        <Root>
            <Logo />
            <PrimaryNav />
            <CollateralMenu />
            <Content />
        </Root>
    );
}

export default App;
