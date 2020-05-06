import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { numberShort } from 'utils/FormatUtils';
import Divider from './Divider';
import { useSelector } from 'react-redux';

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

    .color-faded {
        color: var(--color-foreground-15);
    }
    .color-regular {
        color: var(--color-foreground-30);
    }
    &.active, &:hover {
        .color-faded {
            color: var(--color-foreground-30);
        }
        .color-regular {
            color: var(--color-foreground-50);
        }
    }
`;

const Left = styled.div`
    flex: 1;
`;

const Right = styled.div`
    font-size: 1.8rem;
    font-weight: bold;

    @media (max-width: 1600px) {
        display: none;
    }
`;

const Label = styled.div`
    font-size: 1rem;
    font-weight: 300;
    text-transform: uppercase;
`;

const Value = styled.div`
    font-size: 1.5rem;
    font-weight: bold;
`;

function VaultMenuItem ({ vault }) {
    const { activeQuery } = useSelector(state => state.query);

    return (
        <Wrapper>
            <NavLinkWrapper to={activeQuery.clone({ collateral:vault.collateral, vault }).toUrl()}>
                <Left>
                    <Label className="color-faded">Vault</Label>
                    <Value className="color-regular">{vault.identifier}</Value>
                </Left>
                <Right className="color-regular">
                    {numberShort(vault.daiIssued)}
                </Right>
                <Divider className="divider" display="color" />
            </NavLinkWrapper>
            <Divider style={{ backgroundColor: "var(--color-foreground-faded)" }} orientation="horizontal" />
        </Wrapper>
    );
}

VaultMenuItem.propTypes = {
    vault: PropTypes.object.isRequired
};

export default VaultMenuItem;