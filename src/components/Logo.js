import React from 'react';
import styled from 'styled-components';
import ImageAsset from 'assets/logo.svg';
import { NavLink } from 'react-router-dom';

const Wrapper = styled.div`
    padding: 20px 15px;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
`;

const Image = styled.img`

`;

function Logo () {
    return (
        <Wrapper>
            <NavLink to="/">
                <Image src={ImageAsset} alt="Maker Logo"></Image>
            </NavLink>
        </Wrapper>
    );
}

export default Logo;