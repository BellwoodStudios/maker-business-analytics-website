import React from 'react';
import styled from 'styled-components';
import Collateral from 'components/Collateral';
import Divider from 'components/Divider';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(0, 0, 0, 0.15);
`;

function CollateralMenu () {
    return (
        <Wrapper>
            <Collateral></Collateral>
            <Divider orientation='horizontal'></Divider>
        </Wrapper>
    );
}

export default CollateralMenu;