import React from 'react';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
import Dashboard from 'components/Dashboard';
import VaultMenu from 'components/VaultMenu';
import ChartDisplay from 'components/ChartDisplay';

const Wrapper = styled.div`
    display: flex;
`;

const ContentInner = styled.div`
    flex: 1;
`;

function Content () {
    return (
        <Wrapper>
            <Route path="/vaults/:ticker"><VaultMenu /></Route>
            <ContentInner>
                <Switch>
                    <Route exact path="/"><Dashboard /></Route>
                    <Route exact path="/vaults/:ticker/:vault?"><ChartDisplay /></Route>
                </Switch>
            </ContentInner>
        </Wrapper>
    );
}

export default Content;