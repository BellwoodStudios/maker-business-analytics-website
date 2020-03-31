import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAvailableStats } from 'reducers/stats';
import Divider from 'components/Divider';
import StatsList from 'components/StatsList';
import GraphSrc from 'assets/graph.png';
import SummaryPill from 'components/SummaryPill';
import { numberShort, percent, dateLong } from 'utils/FormatUtils';
import DateRangeToolbar from 'components/DateRangeToolbar';

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

const Label = styled.div`
    font-size: 1.6rem;
    font-weight: 300;
    text-transform: uppercase;
    color: var(--color-foreground-30);
`;

const Value = styled.div`
    font-size: 2.5rem;
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
    const { collateral, vault } = useParams();
    const dispatch = useDispatch();
    const { payload } = useSelector(state => state.stats);
    const { activeStats } = useSelector(state => state.ui.stats);

    useEffect(() => {
        dispatch(fetchAvailableStats({ collateral, vault }));
    }, [dispatch, collateral, vault]);

    const filterLabel = vault != null ? "Vault" : "Collateral";
    const filterValue = vault ?? collateral;

    return (
        <Wrapper>
            <Content>
                <Label>{filterLabel}</Label>
                <Value>{filterValue}</Value>
                <DateRangeToolbar />
                <img style={{ margin: "30px 0" }} alt="Chart" src={GraphSrc} />
                <SummaryDetails>
                    { payload?.filter(stat => {
                        return activeStats.includes(stat.name);
                    }).map((stat, i) => {
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