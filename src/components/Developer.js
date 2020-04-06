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

function Developer () {
    return (
        <Wrapper>
            <Header>Get Involved!</Header>
            <Paragraph>Maker Business Analytics is completely open source. We encourage developers to participate in improving this site.</Paragraph>
            <Paragraph>GitHub: <a rel="noopener noreferrer" href="https://github.com/BellwoodStudios/maker-business-analytics-website" target="_blank">https://github.com/BellwoodStudios/maker-business-analytics-website</a></Paragraph>
        </Wrapper>
    );
}

export default Developer;