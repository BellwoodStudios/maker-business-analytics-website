import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Divider from 'components/Divider';
import StatsList from 'components/StatsList';
import DateRangeToolbar from 'components/DateRangeToolbar';
import Share from 'components/Share';
import { QueryType } from 'model';
import { getStats } from 'api';
import { setActiveQuery, executeQuery } from 'reducers/query';
import Chart from 'components/Chart';
import StatDataSummaryPill from 'components/StatDataSummaryPill';

const Wrapper = styled.div`
    display: flex;
    height: 100%;
`;

const Content = styled.div`
    flex: 1;
    padding: 20px;
`;

const ContentTop = styled.div`
    display: flex;
`;

const ContentLeft = styled.div`
    flex: 1;
`;

const ContentRight = styled.div`
    
`;

const Right = styled.div`
    width: 250px;
    background: rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Label = styled.div`
    font-size: 1.4rem;
    font-weight: 300;
    text-transform: uppercase;
    color: var(--color-foreground-30);
`;

const Value = styled.div`
    font-size: 2.2rem;
    line-height: 2.5rem;
    font-weight: bold;
    color: var(--color-foreground-50);
`;

const RightHeader = styled.h1`
    margin: 0;
    font-size: 0.9rem;
    font-weight: 300;
    text-transform: uppercase;
    color: var(--color-foreground-30);
    width: 100%;
    padding: 10px;
`;

const SummaryDetails = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 20px;
    grid-row-gap: 20px;

    @media (max-width: 1300px) {
        grid-template-columns: 1fr;
    }
`;

function ChartDisplay () {
    const dispatch = useDispatch();
    const { collateralName, vaultName } = useParams();
    const { activeQuery, activeQueryResult } = useSelector(state => state.query);
    const stats = getStats(activeQuery);
    const activeStats = activeQuery.filterActiveStats(stats);

    // Update the query from the URL
    useEffect(() => {
        const newQuery = activeQuery.clone({ collateral:collateralName, vault:vaultName });
        if (!newQuery.equals(activeQuery)) {
            dispatch(setActiveQuery(newQuery));
        }
    }, [activeQuery, collateralName, vaultName, dispatch]);

    // Fetch new data if the query url changes
    useEffect(() => {
        // This is a little hacky, but it skips loading 2 things at once
        if ((collateralName != null && activeQuery.collateral == null) || (vaultName != null && activeQuery.vault == null)) return;

        dispatch(executeQuery(activeQuery));
    }, [activeQuery, dispatch, collateralName, vaultName]);

    // Log api errors
    useEffect(() => {
        if (activeQueryResult.error) {
            console.error(activeQueryResult.error)
        }
    }, [activeQueryResult]);

    let filterLabel;
    let filterValue;

    switch (activeQuery.type) {
        case QueryType.VAULT:
            // Vault specific view
            filterLabel = "Vault";
            filterValue = activeQuery.vault.name;

            break;
        case QueryType.COLLATERAL:
            // Collateral specific view
            filterLabel = "Collateral";
            filterValue = activeQuery.collateral.name;

            break;
        case QueryType.GLOBAL:
            // Viewing across all collateral types
            filterLabel = "Collateral";
            filterValue = "All";

            break;
        default: throw new Error('Unknown query type');
    }

    return (
        <Wrapper>
            <Content>
                <ContentTop>
                    <ContentLeft>
                        <Label>{filterLabel}</Label>
                        <Value>{filterValue}</Value>
                    </ContentLeft>
                    <ContentRight>
                        <Share />
                    </ContentRight>
                </ContentTop>
                <DateRangeToolbar />
                <Chart query={activeQuery} activeStats={activeStats} data={activeQueryResult.payload} />
                <SummaryDetails>
                    { activeStats.map((stat, i) => {
                        const data = activeQueryResult.payload?.find(sd => sd.stat.name === stat.name)?.packedData;
                        return <StatDataSummaryPill key={i} stat={stat} data={data != null && data.length > 0 ? data[data.length - 1] : null} />;
                    }) }
                </SummaryDetails>
            </Content>
            <Right>
                <RightHeader>{`${filterValue} Statistics`}</RightHeader>
                <Divider style={{ backgroundColor: "var(--color-foreground-15)" }} orientation="horizontal" />
                <StatsList />
            </Right>
        </Wrapper>
    );
}

export default ChartDisplay;