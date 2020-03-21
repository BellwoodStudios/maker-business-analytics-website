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
    const collateralTypes = [
        'eth',
        'bat',
        'usdc'
    ];

    return (
        <Wrapper>
            <CollateralMenuItem nobackground to="/" title="Dashboard" icon="dashboard"><Icon className="material-icons">dashboard</Icon></CollateralMenuItem>
            <Divider style={{ margin: "10px 0" }} orientation='horizontal'></Divider>
            { collateralTypes.map(type => <CollateralMenuItem style={{ marginBottom: "10px" }} title={type.toUpperCase()} to={`/collateral/${type}`} ><Collateral src={`/images/collateral/${type}.svg`} /></CollateralMenuItem>) }
        </Wrapper>
    );
}

export default CollateralMenu;