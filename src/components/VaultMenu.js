import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import VaultMenuItem from 'components/VaultMenuItem';
import { useSelector, useDispatch } from 'react-redux';
import { loadVaultsByCollateral } from 'reducers/vaults';

const Wrapper = styled.ul`
    width: 320px;
    background: rgba(0, 0, 0, 0.1);
`;

function VaultMenu () {
    const { ticker } = useParams();
    const { loaded, payload } = useSelector(state => state.vaults);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadVaultsByCollateral(ticker));
    }, [dispatch, ticker]);

    return (
        <Wrapper>
            { !loaded ? <div>Loading</div> : payload.map((v, i) => <VaultMenuItem key={i} vault={v} />) }
        </Wrapper>
    );
}

export default VaultMenu;