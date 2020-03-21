import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import VaultMenuItem from 'components/VaultMenuItem';

const Wrapper = styled.ul`
    width: 320px;
    background: rgba(0, 0, 0, 0.1);
`;

function VaultMenu () {
    const { ticker } = useParams();

    // TODO don't hardcode this
    const vaultsByCollateralTypeAvailable = {
        'ETH': [
            {
                name: "ETH-A",
                collateral: "ETH",
                daiIssued: 1280000000
            },
            {
                name: "ETH-B",
                collateral: "ETH",
                daiIssued: 370000000
            },
            {
                name: "ETH-C",
                collateral: "ETH",
                daiIssued: 34563
            },
            {
                name: "ETH-D",
                collateral: "ETH",
                daiIssued: 3834563
            }
        ],
        'BAT': [
            {
                name: "BAT-A",
                collateral: "BAT",
                daiIssued: 300000
            }
        ],
        'USDC': [
            {
                name: "USDC-A",
                collateral: "USDC",
                daiIssued: 6234723
            }
        ]
    };
    const vaultsAvailable = vaultsByCollateralTypeAvailable[ticker];

    return (
        <Wrapper>
            { vaultsAvailable.map(v => <VaultMenuItem vault={v} />) }
        </Wrapper>
    );
}

export default VaultMenu;