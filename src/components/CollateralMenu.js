import React from 'react';
import styled from 'styled-components';
import CollateralMenuItem from 'components/CollateralMenuItem';
import Divider from 'components/Divider';
import { getCollateral } from 'api';
import { useSelector } from 'react-redux';

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
    const collateral = getCollateral();
    const { activeQuery } = useSelector(state => state.query);

    return (
        <Wrapper>
            <CollateralMenuItem exact nobackground to={activeQuery.clone({ collateral:null, vault:null }).toUrl()} title="Dashboard" icon="dashboard"><Icon className="material-icons">dashboard</Icon></CollateralMenuItem>
            <Divider style={{ margin: "10px 0" }} orientation='horizontal'></Divider>
            {collateral.map((c, i) => <CollateralMenuItem key={i} style={{ marginBottom: "10px" }} title={c.name} to={activeQuery.clone({ collateral:c.name, vault:null }).toUrl()} ><Collateral src={`/images/collateral/${c.name.toLowerCase()}.svg`} /></CollateralMenuItem>)}
        </Wrapper>
    );
}

export default CollateralMenu;