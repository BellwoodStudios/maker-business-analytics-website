import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveQuery } from 'reducers/query';
import { DateRangePicker } from 'react-date-range';
import Icon from 'components/Icon';
import moment from 'moment';
import { dateWithGranularity } from 'utils/FormatUtils';
import { QueryGranularity } from 'model';
import { getStats } from 'api';
import { toDataArray, download } from 'utils';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const Wrapper = styled.div`
    display: flex;
    position: relative;
`;

const Title = styled.div`
    flex: 1;
    font-size: 1.8rem;
    font-weight: bold;
    color: var(--color-foreground-50);
    display: flex;
    align-items: center;
    padding: 0 15px;
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

const DateRangeWrapper = styled.div`
    position: relative;
    margin-right: 8px;
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
    margin: 8px 0;
    z-index: 10;
`;

const MoreMenuWrapper = styled.div`
    position: relative;
`;

const MoreMenu = styled.ul`
    position: absolute;
    right: 0;
    top: 100%;
    margin: 8px 0;
    z-index: 10;
    background: rgba(0, 0, 0, 0.3);
    width: 200px;
    border-radius: 10px;
`;

const MoreMenuItem = styled.li`
    position: relative;
`;

const MoreMenuItemAnchor = styled.a`
    display: block;
    padding: 10px 20px;
    font-weight: bold;
`;

function DateRangeToolbar ({ title }) {
    const { activeQuery, results } = useSelector(state => state.query);
    const stats = getStats(activeQuery);
    const activeStats = activeQuery.filterActiveStats(stats);
    const activeQueryResult = results[activeQuery.toUrl()];
    const dispatch = useDispatch();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        function onDocumentClick (e) {
            // Don't hide when clicking the date picker
            if (e.target.closest('.block-menu-hide')) return;
            
            if (showDatePicker) {
                setShowDatePicker(false);
            }
            if (showMenu) {
                setShowMenu(false);
            }
        }

        document.addEventListener("click", onDocumentClick);
        return function cleanup () {
            document.removeEventListener("click", onDocumentClick);
        };
    }, [showDatePicker, showMenu]);

    return (
        <Wrapper>
            <Title>{title}</Title>
            <Granularity value={activeQuery.granularity} onChange={(e) => dispatch(setActiveQuery(activeQuery.clone({ granularity:e.target.value })))}>
                { Object.values(QueryGranularity).map((g, i) => <option key={i} value={g}>{g}</option>) }
            </Granularity>
            <RangeText>
                <RangeStartText>{dateWithGranularity(activeQuery.start, activeQuery.granularity)}</RangeStartText>
                <RangeEndText>{dateWithGranularity(activeQuery.end, activeQuery.granularity)}</RangeEndText>
            </RangeText>
            <DateRangeWrapper className="block-menu-hide">
                <RangeIcon href="#" onClick={(e) => { e.preventDefault(); setShowDatePicker(!showDatePicker); } }>
                    <Icon name="date_range" />
                </RangeIcon>
                <DateRangePickerWrapper style={{ display: showDatePicker ? "block" : "none" }}>
                    <DateRangePicker
                        onChange={({ main }) => dispatch(setActiveQuery(activeQuery.clone({ start:moment(main.startDate), end:moment(main.endDate) })))}
                        ranges={[{ startDate:activeQuery.start.toDate(), endDate:activeQuery.end.toDate(), key:"main" }]}
                    />
                </DateRangePickerWrapper>
            </DateRangeWrapper>
            <MoreMenuWrapper>
                <RangeIcon className="block-menu-hide" href="#" onClick={(e) => { e.preventDefault(); setShowMenu(!showMenu); } }>
                    <Icon name="more_vert" />
                </RangeIcon>
                <MoreMenu style={{ display: showMenu ? "block" : "none" }}>
                    <MoreMenuItem>
                        <MoreMenuItemAnchor href="#" onClick={(e) => {
                            const data = toDataArray(activeStats, activeQueryResult.payload);
                            const text = data.map(row => {
                                return row.join(",");
                            }).join("\n");
                            download("mkranalytics-export.csv", text);
                        }}>
                            Export CSV...
                        </MoreMenuItemAnchor>
                    </MoreMenuItem>
                </MoreMenu>
            </MoreMenuWrapper>
        </Wrapper>
    );
}

export default DateRangeToolbar;