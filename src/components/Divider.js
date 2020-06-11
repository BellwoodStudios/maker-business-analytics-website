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

    ${props => props.length != null && props.orientation !== 'horizontal' && css`
        height: ${props.length};
    `}

    ${props => props.length != null && props.orientation === 'horizontal' && css`
        width: ${props.length};
    `}

    ${props => props.thickness != null && props.orientation !== 'horizontal' && css`
        width: ${props.thickness};
    `}

    ${props => props.thickness != null && props.orientation === 'horizontal' && css`
        height: ${props.thickness};
    `}

    ${props => props.background != null && css`
        background: ${props.background};
    `}
`;

export default Divider;