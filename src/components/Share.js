import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
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
    const { collateralName, vaultName } = useParams();
    const { activeStats } = useSelector(state => state.ui.stats);
    const { start, end, granularity } = useSelector(state => state.ui.dateRange);
    const origin = window.location.origin;

    if (link == null) {
        link = origin;
        if (collateralName != null) {
            link += `/vaults/${collateralName}`;
        }
        if (vaultName != null) {
            link += `/${vaultName}`;
        }
        const params = {
            activeStats,
            start,
            end,
            granularity
        };
        link += "?" + Object.keys(params).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join("&");
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