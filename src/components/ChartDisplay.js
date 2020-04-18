import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Divider from 'components/Divider';
import StatsList from 'components/StatsList';
import SummaryPill from 'components/SummaryPill';
import { numberShort, percent, dateLong } from 'utils/FormatUtils';
import DateRangeToolbar from 'components/DateRangeToolbar';
import Share from 'components/Share';
import { Chart } from "react-google-charts";
import { Query, QueryType } from 'model';
import { getStats } from 'api';
import { setActiveQuery } from 'reducers/query';

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
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: 20px;
    grid-row-gap: 20px;

    @media (max-width: 1400px) {
        grid-template-columns: 1fr 1fr;
    }
    @media (max-width: 1100px) {
        grid-template-columns: 1fr;
    }
`;

function formatStatValue (stat) {
    switch (stat.type) {
        case "number": return numberShort(stat.value);
        case "percent": return percent(stat.value);
        default: throw new Error(`Unknown stat type '${stat.type}'.`);
    }
}

function ChartDisplay () {
    const dispatch = useDispatch();
    const { collateralName, vaultName } = useParams();
    const { activeQuery } = useSelector(state => state.query);
    const stats = getStats(activeQuery);
    const statsData = null;

    useEffect(() => {
        const newQuery = Query.createFromParams({ collateralName, vaultName });
        dispatch(setActiveQuery(activeQuery.clone({ collateral:newQuery.collateral, vault:newQuery.vault })));
    }, [collateralName, vaultName, dispatch]);


    /*useEffect(() => {
        if (stats != null) dispatch(fetchStatsData(stats, { collateralName, vaultName, start, end, granularity }));
    }, [dispatch, stats, collateralName, vaultName, start, end, granularity]);*/

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
                { statsData != null && statsData.find(s => s != null) != null ? 
                    <Chart
                        chartType="LineChart"
                        data={[["Date", "Stability Fee"], ...statsData.find(s => s != null).filter(s => s.fee !== -1).map(s => [s.block.timestamp.toDate(), s.fee])]}
                        width="100%"
                        height="400px"
                    /> : null }
                <SummaryDetails>
                    { activeQuery.filterActiveStats(stats).map((stat, i) => {
                        return <SummaryPill key={i} label={stat.name} sublabel={dateLong()} color={stat.color} value={formatStatValue(stat)} />;
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