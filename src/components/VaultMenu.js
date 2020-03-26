import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import VaultMenuItem from 'components/VaultMenuItem';
import { useSelector } from 'react-redux';

const Wrapper = styled.ul`
    width: 320px;
    background: rgba(0, 0, 0, 0.1);
`;

function VaultMenu () {
    const { ticker } = useParams();
    const { loading, typesByCollateral } = useSelector(state => state.vaults);

    const vaultsAvailable = typesByCollateral[ticker];

    return (
        <Wrapper>
            { loading ? <div>Loading</div> : vaultsAvailable.map(v => <VaultMenuItem vault={v} />) }
        </Wrapper>
    );
}

export default VaultMenu;