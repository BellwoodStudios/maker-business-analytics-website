import React, { useEffect } from 'react';
import styled from 'styled-components';
import ColoredCheckbox from 'components/ColoredCheckbox';
import { useSelector, useDispatch } from 'react-redux';
import Loader from 'components/Loader';
import { setStatActive, setActiveStats } from 'reducers/ui';

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
    const { loaded, payload } = useSelector(state => state.stats);
    const { activeStats } = useSelector(state => state.ui.stats);

    // If the URL contains active stats then set this right away on load
    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const activeStats = query.get("activeStats");
        if (activeStats) {
            dispatch(setActiveStats(activeStats.split(",")));
        }
    }, [dispatch]);

    return (
        <Loader loading={!loaded}>
            <List>
                {payload?.map((s, i) => {
                    const active = activeStats.includes(s.name);

                    return (<ListItem key={i} onClick={() => dispatch(setStatActive(s.name, !active))}>
                        <ColoredCheckbox color={s.color} checked={active} />
                        <Label style={{ color: !active ? "var(--color-foreground-secondary)" : null }}>{s.name}</Label>
                    </ListItem>)
                })}
            </List>
        </Loader>
    );
}

export default StatsList;