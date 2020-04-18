import React from 'react';
import styled from 'styled-components';
import ColoredCheckbox from 'components/ColoredCheckbox';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveQuery } from 'reducers/query';
import { getStats } from 'api';

const List = styled.ul`
    width: 100%;
`;

const ListItem = styled.li`
    padding: 20px 25px;
    cursor: pointer;
    font-weight: bold;
    display: flex;
    align-items: center;

    &:hover {
        background: linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.15))
    }
`;

const Label = styled.div`
    flex: 1;
    padding: 0 10px;
`;

/**
 * Display a list of stats that available.
 */
function StatsList () {
    const dispatch = useDispatch();
    const { activeQuery } = useSelector(state => state.query);
    const stats = getStats(activeQuery);
    const activeStats = activeQuery.filterActiveStats(stats);

    return (
        <List>
            {stats.map((s, i) => {
                const active = activeStats.includes(s);

                return (<ListItem key={i} onClick={() => dispatch(setActiveQuery(activeQuery.setStatActive(s, !active)))}>
                    <ColoredCheckbox color={s.color} checked={active} />
                    <Label style={{ color: !active ? "var(--color-foreground-secondary)" : null }}>{s.name}</Label>
                </ListItem>)
            })}
        </List>
    );
}

export default StatsList;