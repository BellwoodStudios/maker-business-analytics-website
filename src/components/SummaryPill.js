import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    display: flex;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
`;

const Left = styled.div`
    width: 96px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
`;

const Right = styled.div`
    flex: 1;
    padding: 15px;
`;

const Value = styled.div`
    font-weight: bold;
    font-size: 1.5rem;
`;

const Label = styled.div`
    font-size: 1.2rem;
    font-weight: bold;
`;

const SubLabel = styled.div`
    font-size: 0.9rem;
    font-weight: 300;
    color: var(--color-foreground-30);
`;

/**
 * A summary pill is a colored label, sublabel and value combo.
 */
function SummaryPill ({ label, sublabel, value, color }) {
    return (
        <Wrapper>
            <Left style={{ background: color ? color : null }}>
                <Value>{value}</Value>
            </Left>
            <Right>
                <Label>{label}</Label>
                <SubLabel>{sublabel}</SubLabel>
            </Right>
        </Wrapper>
    );
}

export default SummaryPill;