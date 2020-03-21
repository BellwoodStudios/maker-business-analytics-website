import React from 'react';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
import Dashboard from 'components/Dashboard';
import VaultMenu from 'components/VaultMenu';

const Wrapper = styled.div`
    display: flex;
`;

function Content () {
    return (
        <Wrapper>
            <Route path="/vaults/:ticker"><VaultMenu /></Route>
            <Switch>
                <Route exact path="/"><Dashboard /></Route>
            </Switch>
        </Wrapper>
    );
}

export default Content;