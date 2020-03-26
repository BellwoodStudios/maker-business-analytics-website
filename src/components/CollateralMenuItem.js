import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import Divider from 'components/Divider';

const Wrapper = styled.li`
`;

const NavLinkIcon = styled(NavLink)`
    display: flex;
    position: relative;
    width: 60px;
    height: 60px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;

    .divider {
        display: none;
    }

    &.active {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        width: 70px;
        margin-left: 10px;

        & > * {
            margin-left: -10px;
        }

        .divider {
            display: block;
            position: absolute;
            right: 0;
        }
    }
`;

function CollateralMenuItem ({ to, children, title, style, nobackground, exact }) {
    return (
        <Wrapper style={style}>
            <NavLinkIcon exact={exact} title={title} to={to} style={{ backgroundColor: nobackground ? "none" : "rgba(0, 0, 0, 0.2)" }}>
                {children}
                { !nobackground ? <Divider className="divider" display="color" /> : null }
            </NavLinkIcon>
        </Wrapper>
    );
}

CollateralMenuItem.propTypes = {
    to: PropTypes.string.isRequired,
    title: PropTypes.string,
    style: PropTypes.object,
    nobackground: PropTypes.bool,
    exact: PropTypes.bool
};

export default CollateralMenuItem;