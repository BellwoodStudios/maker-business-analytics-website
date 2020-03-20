import React from 'react';
import styled from 'styled-components';
import LogoImageAsset from 'assets/logo.svg';
import { NavLink } from 'react-router-dom';

const LogoWrapper = styled.div`
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
`;

const LogoImage = styled.img`

`;

function Logo () {
    return (
        <LogoWrapper>
            <NavLink to="/">
                <LogoImage src={LogoImageAsset}></LogoImage>
            </NavLink>
        </LogoWrapper>
    );
}

export default Logo;