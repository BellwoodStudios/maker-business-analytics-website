import React from 'react';
import styled from 'styled-components';
import ColoredCheckbox from 'components/ColoredCheckbox';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveQuery } from 'reducers/query';
import { getStats } from 'api';
import { QueryType } from 'model';
import { StatTargets } from 'api/model';
import Divider from 'components/Divider';

const Wrapper = styled.div`
    width: 100%;
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
    padding: 10px;
`;

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
    let stats = getStats(activeQuery);
    const activeStats = activeQuery.filterActiveStats(stats);

    let primaryCategory;
    switch (activeQuery.type) {
        case QueryType.VAULT: primaryCategory = "Vault"; break;
        case QueryType.COLLATERAL: primaryCategory = "Collateral"; break;
        case QueryType.GLOBAL: primaryCategory = "Global"; break;
        default: throw new Error('Unknown query type');
    }

    // Pull out any global stats for vault/collateral views and put them at the bottom
    let globalStats = [];
    if (activeQuery.type === QueryType.COLLATERAL || activeQuery.type === QueryType.VAULT) {
        globalStats = stats.filter(s => s.targets === StatTargets.GLOBAL);
        stats = stats.filter(s => s.targets !== StatTargets.GLOBAL);
    }

    return (
        <Wrapper>
            <SectionWrapper>
                <Header>{`${primaryCategory} Statistics`}</Header>
                <Divider style={{ backgroundColor: "var(--color-foreground-15)" }} orientation="horizontal" />
                <List>
                    {stats.map((s, i) => {
                        const active = activeStats.includes(s);

                        return (<ListItem key={i} onClick={() => dispatch(setActiveQuery(activeQuery.setStatActive(s, !active)))}>
                            <ColoredCheckbox color={s.color} checked={active} />
                            <Label style={{ color: !active ? "var(--color-foreground-secondary)" : null }}>{s.name}</Label>
                        </ListItem>)
                    })}
                </List>
            </SectionWrapper>
            {
                globalStats.length > 0 ?
                <SectionWrapper>
                    <Header>{`Global Statistics`}</Header>
                    <Divider style={{ backgroundColor: "var(--color-foreground-15)" }} orientation="horizontal" />
                    <List>
                        {globalStats.map((s, i) => {
                            const active = activeStats.includes(s);
        
                            return (<ListItem key={i} onClick={() => dispatch(setActiveQuery(activeQuery.setStatActive(s, !active)))}>
                                <ColoredCheckbox color={s.color} checked={active} />
                                <Label style={{ color: !active ? "var(--color-foreground-secondary)" : null }}>{s.name}</Label>
                            </ListItem>)
                        })}
                    </List>
                </SectionWrapper>
                : null
            }
        </Wrapper>
    );
}

export default StatsList;