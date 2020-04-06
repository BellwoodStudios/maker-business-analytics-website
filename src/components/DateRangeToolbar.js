import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { setGranularity, setDateRange } from 'reducers/ui';
import { DateRangePicker } from 'react-date-range';
import moment from 'moment';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const Wrapper = styled.div`
    display: flex;
    position: relative;
`;

const Scrubber = styled.div`
    flex: 1;
`;

const Granularity = styled.select`

`;

const RangeText = styled.div`
    display: flex;
    margin: 0 20px;
    font-weight: bold;
    align-items: center;
`;

const RangeStartText = styled.div`
    &::after {
        content: "—";
        font-weight: 900;
        padding: 0 15px;
    }
`;

const RangeEndText = styled.div`

`;

const RangeIcon = styled.a`
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.15);
    border-radius: 50%;
    width: 38px;
    height: 38px;
`;

const DateRangePickerWrapper = styled.div`
    position: absolute;
    right: 0;
    top: 100%;
    margin: 8px;
`;

function formatTime (date, granularity) {
    switch (granularity) {
        case "hour": return date.format("D MMM. YYYY HH:00");
        case "day": return date.format("D MMM. YYYY");
        case "week": return date.format("[Week] W YYYY");
        case "month": return date.format("MMM. YYYY");
        case "year": return date.format("YYYY");
        default: return date.toString();
    }
}

function DateRangeToolbar () {
    const { start, end, granularity, granularityOptions } = useSelector(state => state.ui.dateRange);
    const dispatch = useDispatch();
    const [showDatePicker, setShowDatePicker] = useState(false);

    return (
        <Wrapper>
            <Scrubber />
            <Granularity onChange={(e) => dispatch(setGranularity(e.target.value))}>
                { granularityOptions.map((g, i) => <option selected={g.name === granularity} key={i} value={g.name}>{g.label}</option>) }
            </Granularity>
            <RangeText>
                <RangeStartText>{formatTime(start, granularity)}</RangeStartText>
                <RangeEndText>{formatTime(end, granularity)}</RangeEndText>
            </RangeText>
            <RangeIcon href="#" onClick={() => setShowDatePicker(!showDatePicker)}>
                <i className="material-icons">date_range</i>
            </RangeIcon>
            <DateRangePickerWrapper style={{ display: showDatePicker ? "block" : "none" }}>
                <DateRangePicker
                    onChange={({ main }) => dispatch(setDateRange(moment(main.startDate), moment(main.endDate)))}
                    ranges={[{ startDate:start.toDate(), endDate:end.toDate(), key:"main" }]}
                />
            </DateRangePickerWrapper>
        </Wrapper>
    );
}

export default DateRangeToolbar;