import React from 'react';
import styled from 'styled-components';
import VaultMenuItem from 'components/VaultMenuItem';
import { useSelector } from 'react-redux';

const Wrapper = styled.ul`
    width: 160px;
    background: rgba(0, 0, 0, 0.1);
`;

function VaultMenu () {
    const { activeQuery } = useSelector(state => state.query);

    return (
        <Wrapper>
            {activeQuery.collateral?.vaults.map((v, i) => <VaultMenuItem key={i} vault={v} />)}
        </Wrapper>
    );
}

export default VaultMenu;