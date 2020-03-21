import React from 'react';
import styled from 'styled-components';
import CollateralMenuItem from 'components/CollateralMenuItem';
import Divider from 'components/Divider';

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
    // TODO don't hardcode this
    const collateralAvailable = [
        { name:"Ethereum", ticker:"ETH" },
        { name:"Basic Attention Token", ticker:"BAT" },
        { name:"USDC", ticker:"USDC" }
    ];

    return (
        <Wrapper>
            <CollateralMenuItem exact nobackground to="/" title="Dashboard" icon="dashboard"><Icon className="material-icons">dashboard</Icon></CollateralMenuItem>
            <Divider style={{ margin: "10px 0" }} orientation='horizontal'></Divider>
            { collateralAvailable.map(c => <CollateralMenuItem style={{ marginBottom: "10px" }} title={c.name} to={`/vaults/${c.ticker}`} ><Collateral src={`/images/collateral/${c.ticker.toLowerCase()}.svg`} /></CollateralMenuItem>) }
        </Wrapper>
    );
}

export default CollateralMenu;