import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchAvailableStats } from 'reducers/stats';
import Divider from 'components/Divider';
import StatsList from 'components/StatsList';

const Wrapper = styled.div`
    display: flex;
    height: 100%;
`;

const Content = styled.div`
    flex: 1;
    padding: 20px;
`;

const Right = styled.div`
    width: 320px;
    background: rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Label = styled.div`
    font-size: 1.8rem;
    font-weight: 300;
    text-transform: uppercase;
    color: var(--color-foreground-30);
`;

const Value = styled.div`
    font-size: 3rem;
    font-weight: bold;
    color: var(--color-foreground-50);
`;

const Header = styled.h1`
    margin: 0;
    font-size: 1rem;
    font-weight: 300;
    text-transform: uppercase;
    color: var(--color-foreground-30);
    width: 100%;
    padding: 10px;
`;

function ChartDisplay () {
    const { collateral, vault } = useParams();
    const dispatch = useDispatch();

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
            </Content>
            <Right>
                <Header>{`${filterValue} Statistics`}</Header>
                <Divider style={{ backgroundColor: "var(--color-foreground-15)" }} orientation="horizontal" />
                <StatsList />
            </Right>
        </Wrapper>
    );
}

export default ChartDisplay;