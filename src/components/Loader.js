import React from 'react';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';

const rotate = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

const Spinner = styled.div`
    margin: 15px auto;
    border-top: 6px solid var(--color-foreground-15);
    border-right: 6px solid var(--color-foreground-15);
    border-bottom: 6px solid var(--color-foreground-15);
    border-left: 6px solid var(--color-foreground-50);
    transform: translateZ(0);
    animation: ${rotate} 1.1s infinite linear;
    border-radius: 50%;
    width: 32px;
    height: 32px;
`;

/**
 * Display a loading spinner or the component's children if it's done loading.
 */
function Loader ({ loading, children }) {
    return (
        loading ? <Spinner /> : children
    );
}

Loader.propTypes = {
    loading: PropTypes.bool.isRequired
};

export default Loader;