import React from 'react';
import styled from 'styled-components';
import ColoredCheckbox from 'components/ColoredCheckbox';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
    width: 100%;
`;

const List = styled.ul`
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
function StatsList ({ stats }) {
    return (
        <Wrapper>
            <List>
                {stats.map((s, i) => {
                    return (<ListItem key={i}>
                        <ColoredCheckbox color={s.color} checked={s.checked} />
                        <Label style={{ color: !s.checked ? "var(--color-foreground-secondary)" : null }}>{s.name}</Label>
                    </ListItem>)
                })}
            </List>
        </Wrapper>
    );
}

StatsList.propTypes = {
    color: PropTypes.array.isRequired
};

export default StatsList;