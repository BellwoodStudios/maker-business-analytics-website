import React from 'react';
import styled from 'styled-components';
import Divider from 'components/Divider';

const Wrapper = styled.div`
    margin: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Header = styled.h1`
    padding: 30px 0;
    text-transform: uppercase;
    font-size: 4rem;
`;

const Lines = styled.div`
    font-size: 2.5rem;
    text-align: center;
    margin: 100px 0;
`;

const Line = styled.div`
`;

const Anchor = styled.a`
    display: block;
`;

const Image = styled.img`
    width: 200px;
`;

function Developer () {
    return (
        <Wrapper>
            <Header>Get Involved!</Header>
            <Divider orientation="horizontal" length="70%" thickness="1px" background="rgba(197, 214, 226, 0.3)" />
            <Lines>
                <Line>Maker Business Analytics is completely open source.</Line>
                <Line>We encourage developers to participate in improving this site.</Line>
            </Lines>
            <Anchor href="https://github.com/BellwoodStudios/maker-business-analytics-website" target="_blank"><Image src="/images/github-logo.svg" /></Anchor>
        </Wrapper>
    );
}

export default Developer;