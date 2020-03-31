import React from 'react';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
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
            <Route path="/vaults/:collateral"><VaultMenu /></Route>
            <ContentInner>
                <Switch>
                    <Route exact path="/"><ChartDisplay /></Route>
                    <Route exact path="/vaults/:collateral/:vault?"><ChartDisplay /></Route>
                </Switch>
            </ContentInner>
        </Wrapper>
    );
}

export default Content;