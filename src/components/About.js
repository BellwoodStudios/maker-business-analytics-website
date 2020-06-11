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
    margin: 10px 0 60px 0;
    text-transform: uppercase;
    font-size: 4rem;
`;

const Lines = styled.div`
    font-size: 2rem;
    text-align: center;
    margin: 60px 0 30px 0;
`;

const Line = styled.div`
`;

const Line2 = styled.div`
    font-size: 2rem;
    margin-bottom: 30px;
`;

const Line3 = styled.div`
    margin-top: 60px;
    font-size: 1.4rem;
`;

const Anchor = styled.a`
    display: block;
`;

const BWSImage = styled.img`
    width: 180px;
`;

const DiscordImage = styled.img`
    width: 300px;
`;

function About () {
    return (
        <Wrapper>
            <Anchor href="https://www.bellwoodstudios.com/" target="_blank"><BWSImage src="/images/bellwoodstudios-logo.svg" /></Anchor>
            <Header><Anchor href="https://www.bellwoodstudios.com/" target="_blank">Bellwood Studios</Anchor></Header>
            <Divider orientation="horizontal" length="70%" thickness="1px" background="rgba(197, 214, 226, 0.3)" />
            <Lines>
                <Line>We are a small team based out of Toronto, Canada with an affinity for Maker.</Line>
                <Line>Our main focus is video games, but we occasionally do projects like this.</Line>
            </Lines>
            <Line2>Easiest way to get ahold of us is to reach out on our Discord:</Line2>
            <Anchor href="https://discord.gg/tNUWqyk" target="_blank"><DiscordImage src="/images/discord-logo.svg" /></Anchor>
            <Line3>or feel free to ping <strong>@SamM</strong> on Maker's rocket chat or <strong>@hexonaut</strong> on the Maker forums.</Line3>
        </Wrapper>
    );
}

export default About;