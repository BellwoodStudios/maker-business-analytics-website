import React from 'react';
import PropTypes from 'prop-types';
import { dateLong, statData } from 'utils/FormatUtils';
import SummaryPill from 'components/SummaryPill';

/**
 * Display a summary pill from a stat.
 */
function StatDataSummaryPill ({ stat, data }) {
    return <SummaryPill label={stat.getLongName()} sublabel={dateLong()} color={stat.color} value={data != null ? statData(stat, data) : "-"} />;
}

StatDataSummaryPill.propTypes = {
    stat: PropTypes.object.isRequired,
    data: PropTypes.object
};

export default StatDataSummaryPill;