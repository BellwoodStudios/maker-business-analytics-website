import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { numberShort } from 'util/Format';
import Divider from './Divider';

const Wrapper = styled.li`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const NavLinkWrapper = styled(NavLink)`
    display: flex;
    height: 96px;
    width: 100%;
    align-items: center;
    padding: 0 30px;
    position: relative;

    & > .divider {
        display: none;
    }

    &.active > .divider {
        display: block;
        position: absolute;
        right: 0;
        height: calc(100% - 30px);
    }
`;

const Left = styled.div`
    flex: 1;
`;

const Right = styled.div`
    font-size: 2rem;
    font-weight: bold;
`;

const Label = styled.div`
    font-size: 1rem;
    font-weight: 300;
    text-transform: uppercase;
    color: var(--color-foreground-secondary);
`;

const Value = styled.div`
    font-size: 1.5rem;
    font-weight: bold;
`;

function VaultMenuItem ({ vault }) {
    return (
        <Wrapper>
            <NavLinkWrapper to={`/vaults/${vault.collateral}/${vault.name}`}>
                <Left>
                    <Label>Vault</Label>
                    <Value>{vault.name}</Value>
                </Left>
                <Right>
                    {numberShort(vault.daiIssued)}
                </Right>
                <Divider className="divider" display="color" />
            </NavLinkWrapper>
            <Divider style={{ backgroundColor: "var(--color-foreground-faded)" }} orientation="horizontal" />
        </Wrapper>
    );
}

export default VaultMenuItem;