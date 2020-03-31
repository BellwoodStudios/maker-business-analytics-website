import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { setGranularity } from 'reducers/ui';

const Wrapper = styled.div`
    display: flex;
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
            <RangeIcon href="#">
                <i className="material-icons">date_range</i>
            </RangeIcon>
        </Wrapper>
    );
}

export default DateRangeToolbar;