import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const Wrapper = styled.pre`
    background: rgba(0, 0, 0, 0.15);
    border-radius: 5px;
    padding: 8px;
    font-size: 0.8rem;
    max-width: 300px;
    overflow-x: auto;
    margin: 0;
    user-select: all;
`;

/**
 * Automatically build the link for the active url or manually provide one via the "link" parameter.
 */
function Share ({ link }) {
    const { activeQuery } = useSelector(state => state.query);

    if (link == null) {
        link = activeQuery.toUrl();
    }

    return (
        <Wrapper>
            {link}
        </Wrapper>
    );
}

Share.propTypes = {
    link: PropTypes.string
};

export default Share;