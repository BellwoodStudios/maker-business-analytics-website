import React, { useEffect } from 'react';
import styled from 'styled-components';
import CollateralMenuItem from 'components/CollateralMenuItem';
import Divider from 'components/Divider';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCollateral } from 'reducers/collateral';
import Loader from 'components/Loader';

const Wrapper = styled.ul`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(0, 0, 0, 0.15);
    padding: 10px 0;
`;

const Icon = styled.i`
    font-size: 1.5rem;
`;

const Collateral = styled.img`
    width: 40px;
    height: 40px;
`;

function CollateralMenu () {
    const { loaded, payload } = useSelector(state => state.collateral);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCollateral());
    }, [dispatch]);

    return (
        <Wrapper>
            <CollateralMenuItem exact nobackground to="/" title="Dashboard" icon="dashboard"><Icon className="material-icons">dashboard</Icon></CollateralMenuItem>
            <Divider style={{ margin: "10px 0" }} orientation='horizontal'></Divider>
            <Loader loading={!loaded}>
                {payload?.map((c, i) => <CollateralMenuItem key={i} style={{ marginBottom: "10px" }} title={c.name} to={`/vaults/${c.ticker}`} ><Collateral src={`/images/collateral/${c.ticker.toLowerCase()}.svg`} /></CollateralMenuItem>)}
            </Loader>
        </Wrapper>
    );
}

export default CollateralMenu;