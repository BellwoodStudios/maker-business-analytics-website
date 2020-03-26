import React from 'react';
import styled from 'styled-components';
import ImageAsset from 'assets/logo.svg';
import { NavLink } from 'react-router-dom';

const Wrapper = styled.div`
    padding: 20px;
    background: rgba(0, 0, 0, 0.3);
`;

const Image = styled.img`

`;

function Logo () {
    return (
        <Wrapper>
            <NavLink to="/">
                <Image src={ImageAsset}></Image>
            </NavLink>
        </Wrapper>
    );
}

export default Logo;