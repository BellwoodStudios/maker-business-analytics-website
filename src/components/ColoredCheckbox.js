import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
`;

const Unchecked = styled.div`
    width: 22px;
    height: 22px;
    margin: 1px;
    border-radius: 50%;
    border: solid 2px var(--color-foreground-secondary);
`;

function ColoredCheckbox ({ color, checked }) {
    return (
        <Wrapper>
            { checked ? 
                <i style={{ color }} className="material-icons">check_circle</i> :
                <Unchecked />
            }
        </Wrapper>
    );
}

ColoredCheckbox.propTypes = {
    color: PropTypes.string,
    checked: PropTypes.bool
};

export default ColoredCheckbox;