import React from 'react';
import styled, { css } from 'styled-components';

const Divider = styled.div`
    border-right: solid 2px var(--color-foreground-secondary);
    height: calc(100% - 20px);
    margin: 0 10px;

    ${props => props.orientation == 'horizontal' && css`
        height: auto;
        border-right: none;
        border-bottom: solid 2px var(--color-foreground-secondary);
        width: calc(100% - 20px);
    `}
`;

export default Divider;