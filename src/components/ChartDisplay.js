import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import StatsList from 'components/StatsList';
import DateRangeToolbar from 'components/DateRangeToolbar';
import { Query, QueryType } from 'model';
import { getStats } from 'api';
import { setActiveQuery } from 'reducers/query';
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
    const { activeQuery, firstLoad, results } = useSelector(state => state.query);
    const stats = getStats(activeQuery);
    const activeStats = activeQuery.filterActiveStats(stats);
    const params = { ...useParams() };
    for (const param of new URLSearchParams(useLocation().search).entries()) {
        params[param[0]] = param[1];
    }
    const activeQueryResult = results[activeQuery.toUrl()];

    // Update the query from the URL
    useEffect(() => {
        const newQuery = Query.fromParams(params);
        if (firstLoad || !newQuery.equals(activeQuery)) {
            dispatch(setActiveQuery(newQuery, true));
        }
    }, [activeQuery, params, dispatch, firstLoad]);

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
                    <Label>{filterLabel}</Label>
                    <Value>{filterValue}</Value>
                </ContentTop>
                <DateRangeToolbar />
                <Chart query={activeQuery} activeStats={activeStats} data={activeQueryResult?.payload} error={activeQueryResult?.error} />
                <SummaryDetails>
                    { activeStats.map((stat, i) => {
                        const data = activeQueryResult?.payload?.find(sd => sd.stat.getLongName() === stat.getLongName())?.packedData;
                        return data != null ? <StatDataSummaryPill key={i} stat={stat} data={data} /> : null;
                    }) }
                </SummaryDetails>
            </Content>
            <Right>
                <StatsList />
            </Right>
        </Wrapper>
    );
}

export default ChartDisplay;