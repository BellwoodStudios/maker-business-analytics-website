import React from 'react';
import styled from 'styled-components';
import Divider from 'components/Divider';
import { NavLink } from 'react-router-dom';
import { getLatestBlock } from 'api';

const Wrapper = styled.nav`
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.3);
`;

const NavLeft = styled.div`
    flex: 1;
    padding: 0 20px;
    font-weight: 300;
`;

const NavRight = styled.div`
    display: flex;
    align-items: center;
    font-size: 0.8rem;
`;

const LatestBlock = styled.div`
    padding: 0 20px;
`;

const NavList = styled.ul`
    display: flex;
    margin-right: 20px;
`;

const NavListItem = styled.li`
    border-left: solid 1px var(--color-foreground-secondary);
    padding: 0 20px;
`;

function PrimaryNav () {
    const latestBlock = getLatestBlock();

    return (
        <Wrapper>
            <Divider />
            <NavLeft>Maker Business Analytics</NavLeft>
            <NavRight>
                <LatestBlock>Last sync <span title={latestBlock.timestamp.toString()}>{latestBlock.timestamp.fromNow()}</span> (Block {latestBlock.number})</LatestBlock>
                <NavList>
                    <NavListItem><NavLink to="/developer">Developer</NavLink></NavListItem>
                    <NavListItem><NavLink to="/about">About</NavLink></NavListItem>
                </NavList>
            </NavRight>
        </Wrapper>
    );
}

export default PrimaryNav;