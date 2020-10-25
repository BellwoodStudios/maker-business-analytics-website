import React from 'react';
import styled from 'styled-components';
import ColoredCheckbox from 'components/ColoredCheckbox';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveQuery } from 'reducers/query';
import { getStats } from 'api';
import { StatCategories } from 'api/model';
import Divider from 'components/Divider';

const Wrapper = styled.div`
    width: 100%;
    margin-bottom: 40px;
`;

const SectionWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Header = styled.h1`
    margin: 0;
    font-size: 0.9rem;
    font-weight: 300;
    text-transform: uppercase;
    color: var(--color-foreground-30);
    width: 100%;
    padding: 10px 10px 2px 10px;
`;

const List = styled.ul`
    width: 100%;
    margin-top: 10px;
`;

const ListItem = styled.li`
    padding: 5px 20px;
    font-size: 0.9rem;
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
    let stats = getStats(activeQuery);
    const activeStats = activeQuery.filterActiveStats(stats);
    const categories = Object.values(StatCategories).sort((a, b) => a.priority < b.priority ? -1 : 1).map(c => {
        return {
            label: c.label,
            stats: stats.filter(s => s.category === c)
        };
    });

    return (
        <Wrapper>
            { categories.filter(c => c.stats.length > 0).map((c, i) => {
                return (
                    <SectionWrapper key={i}>
                        <Header>{`${c.label} Stats`}</Header>
                        <Divider style={{ backgroundColor: "var(--color-foreground-15)" }} orientation="horizontal" />
                        <List>
                            {c.stats.map((s, i) => {
                                const active = activeStats.includes(s);
        
                                return (<ListItem key={i} onClick={() => dispatch(setActiveQuery(activeQuery.setStatActive(s, !active)))}>
                                    <ColoredCheckbox color={s.color} checked={active} />
                                    <Label style={{ color: !active ? "var(--color-foreground-secondary)" : null }}>{s.name}</Label>
                                </ListItem>)
                            })}
                        </List>
                    </SectionWrapper>
                );
            }) }
        </Wrapper>
    );
}

export default StatsList;