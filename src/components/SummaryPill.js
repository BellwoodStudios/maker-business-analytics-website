import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
    display: flex;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
`;

const Left = styled.div`
    width: 100px;
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
    font-size: 1.2rem;
`;

const Label = styled.div`
    font-size: 1.1rem;
    font-weight: bold;
`;

const SubLabel = styled.div`
    font-size: 0.8rem;
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

SummaryPill.propTypes = {
    label: PropTypes.string.isRequired,
    sublabel: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    color: PropTypes.string
};

export default SummaryPill;