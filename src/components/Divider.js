import styled, { css } from 'styled-components';

const Divider = styled.div`
    background: var(--color-foreground-secondary);
    width: 2px;
    height: calc(100% - 20px);
    border-radius: 2px;

    ${props => props.orientation === 'horizontal' && css`
        height: 2px;
        width: calc(100% - 20px);
    `}

    ${props => props.display === 'color' && css`
        background: linear-gradient(to bottom, #00FF88, #009191);
    `}

    ${props => props.display === 'color' && props.orientation === 'horizontal' && css`
        background: linear-gradient(to left, #00FF88, #009191);
    `}
`;

export default Divider;