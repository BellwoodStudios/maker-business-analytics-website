import React from 'react';
import PropTypes from 'prop-types';
import { dateLong, dateShort, statData } from 'utils/FormatUtils';
import SummaryPill from 'components/SummaryPill';
import { StatTypes } from 'api/model';

/**
 * Display a summary pill from a stat.
 */
function StatDataSummaryPill ({ stat, data }) {
    const hasData = data.length > 0;
    const firstTimestamp = hasData ? dateShort(data[0].timestamp) : null;
    const lastTimestamp = hasData ? dateShort(data[data.length - 1].timestamp) : null;
    const lastTimestampLong = hasData ? dateLong(data[data.length - 1].timestamp) : null;

    return <SummaryPill label={stat.getLongName()} sublabel={(stat.type === StatTypes.EVENT || stat.type === StatTypes.VALUE_OF_EVENT) ? `${firstTimestamp} - ${lastTimestamp}` : lastTimestampLong} color={stat.color} value={hasData ? statData(stat, data) : "-"} />;
}

StatDataSummaryPill.propTypes = {
    stat: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired
};

export default StatDataSummaryPill;