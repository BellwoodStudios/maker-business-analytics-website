import React from 'react';
import styled from 'styled-components';
import VaultMenuItem from 'components/VaultMenuItem';
import { useSelector } from 'react-redux';

const Wrapper = styled.ul`
    width: 280px;
    background: rgba(0, 0, 0, 0.1);

    @media (max-width: 1600px) {
        width: 150px;
    }
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