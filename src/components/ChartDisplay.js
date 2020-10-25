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

const Right = styled.div`
    width: 250px;
    background: rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
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

    let filterValue;

    switch (activeQuery.type) {
        case QueryType.VAULT:
            // Vault specific view
            filterValue = activeQuery.vault.name;

            break;
        case QueryType.COLLATERAL:
            // Collateral specific view
            filterValue = activeQuery.collateral.name;

            break;
        case QueryType.GLOBAL:
            // Viewing across all collateral types
            filterValue = "All";

            break;
        default: throw new Error('Unknown query type');
    }

    return (
        <Wrapper>
            <Content>
                <DateRangeToolbar title={filterValue} />
                <Chart query={activeQuery} activeStats={activeStats} data={activeQueryResult?.payload} error={activeQueryResult?.error} />
                <SummaryDetails>
                    { activeStats.map((stat, i) => {
                        const data = activeQueryResult?.payload?.find(sd => sd.stat.getLongName() === stat.getLongName())?.data;
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