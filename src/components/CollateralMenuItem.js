import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import Divider from 'components/Divider';

const Wrapper = styled.li`
    width: 100%;
    display: flex;
    justify-content: center;
`;

const NavLinkIcon = styled(NavLink)`
    display: flex;
    position: relative;
    margin: 0 10px;
    width: 100%;
    height: 60px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: border-radius 0.2s, margin 0.2s;

    .divider {
        position: absolute;
        right: 0;
        transform: scaleY(0);
        transition: transform 0.2s;
    }

    &:hover, &.active {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        margin-right: 0;
    }
    &.active {
        .divider {
            transform: scaleY(1);
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