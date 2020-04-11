import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import VaultMenuItem from 'components/VaultMenuItem';
import { useSelector, useDispatch } from 'react-redux';
import { fetchVaultsByCollateral } from 'reducers/vaults';
import Loader from 'components/Loader';

const Wrapper = styled.ul`
    width: 280px;
    background: rgba(0, 0, 0, 0.1);

    @media (max-width: 1600px) {
        width: 150px;
    }
`;

function VaultMenu () {
    const { collateralName } = useParams();
    const { loaded, payload } = useSelector(state => state.vaults);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchVaultsByCollateral(collateralName));
    }, [dispatch, collateralName]);

    return (
        <Wrapper>
            <Loader loading={!loaded}>
                {payload?.map((v, i) => <VaultMenuItem key={i} vault={v} />)}
            </Loader>
        </Wrapper>
    );
}

export default VaultMenu;