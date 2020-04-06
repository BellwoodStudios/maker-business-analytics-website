import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    margin: 20px;
`;

const Header = styled.h1`
    margin: 0 0 20px 0;
`;

const Paragraph = styled.p`

`;

function About () {
    return (
        <Wrapper>
            <Header>About Us</Header>
            <Paragraph>We are a small team based out of Toronto, Canada with an affinity for Maker. Our main focus is video games, but we occasionally do projects like this.</Paragraph>
            <Paragraph>Feel free to get in contact with us or join our discord:</Paragraph>
            <div>
                Discord: <a rel="noopener noreferrer" href="https://discord.gg/tNUWqyk" target="_blank">https://discord.gg/tNUWqyk</a><br />
                Email: <a rel="noopener noreferrer" href="mailto:connect@bellwoodstudios.com" target="_blank">connect@bellwoodstudios.com</a><br />
            </div>
            <Paragraph>Feel free to ping @SamM on Maker's rocket chat or @hexonaut on the Maker forums.</Paragraph>
        </Wrapper>
    );
}

export default About;