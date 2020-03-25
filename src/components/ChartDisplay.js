import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const Wrapper = styled.div`
    display: flex;
    height: 100%;
`;

const Content = styled.div`
    flex: 1;
`;

const Right = styled.div`
    width: 320px;
    background: rgba(0, 0, 0, 0.1);
`;

const Label = styled.div`
    font-size: 1rem;
    font-weight: 300;
    text-transform: uppercase;
`;

const Value = styled.div`
    font-size: 1.5rem;
    font-weight: bold;
`;

function ChartDisplay () {
    return (
        <Wrapper>
            <Content>
                <Label>Vault</Label>
                <Value></Value>
            </Content>
            <Right>

            </Right>
        </Wrapper>
    );
}

export default ChartDisplay;