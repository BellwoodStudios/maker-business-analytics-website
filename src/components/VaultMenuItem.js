import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import Divider from './Divider';

const Wrapper = styled.li`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const NavLinkWrapper = styled(NavLink)`
    display: flex;
    height: 64px;
    width: 100%;
    align-items: center;
    padding: 0 20px;
    position: relative;

    & > .divider {
        transform: scaleY(0);
        transition: transform 0.2s;
        position: absolute;
        right: 0;
        height: calc(100% - 30px);
    }

    &:hover, &.active {
        background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2))
    }

    &.active > .divider {
        transform: scaleY(1);
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

const Label = styled.div`
    font-size: 0.8rem;
    font-weight: 300;
    text-transform: uppercase;
`;

const Value = styled.div`
    font-size: 1.2rem;
    font-weight: bold;
`;

function VaultMenuItem ({ vault, collateral }) {
    let label;
    let link;

    if (vault != null) {
        label = vault.identifier;
        link = `/vaults/${vault.collateral.name}/${vault.name}`;
    } else {
        label = "All";
        link = `/vaults/${collateral.name}`;
    }

    return (
        <Wrapper>
            <NavLinkWrapper to={link} exact={true}>
                <Left>
                    <Label className="color-faded">Vault</Label>
                    <Value className="color-regular">{label}</Value>
                </Left>
                <Divider className="divider" display="color" />
            </NavLinkWrapper>
            <Divider style={{ backgroundColor: "var(--color-foreground-faded)" }} orientation="horizontal" />
        </Wrapper>
    );
}

VaultMenuItem.propTypes = {
    vault: PropTypes.object,
    collateral: PropTypes.object
};

export default VaultMenuItem;