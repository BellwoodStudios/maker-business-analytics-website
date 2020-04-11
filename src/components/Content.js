import React from 'react';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
import VaultMenu from 'components/VaultMenu';
import ChartDisplay from 'components/ChartDisplay';
import Developer from 'components/Developer';
import About from 'components/About';

const Wrapper = styled.div`
    display: flex;
`;

const ContentInner = styled.div`
    flex: 1;
`;

function Content () {
    return (
        <Wrapper>
            <Route path="/vaults/:collateralName"><VaultMenu /></Route>
            <ContentInner>
                <Switch>
                    <Route exact path="/"><ChartDisplay /></Route>
                    <Route exact path="/vaults/:collateralName/:vaultName?"><ChartDisplay /></Route>
                    <Route exact path="/developer"><Developer /></Route>
                    <Route exact path="/about"><About /></Route>
                </Switch>
            </ContentInner>
        </Wrapper>
    );
}

export default Content;