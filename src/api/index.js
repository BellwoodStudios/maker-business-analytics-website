import { timeout } from 'utils/AsyncUtils';

export async function fetchCollateral () {
    await timeout(1000);
    
    // TODO switch from mock api
    return [
        { name:"Ethereum", ticker:"ETH" },
        { name:"Basic Attention Token", ticker:"BAT" },
        { name:"USDC", ticker:"USDC" }
    ];
}

export async function fetchVaultsByCollateral (collateralTickerName) {
    await timeout(1000);

    // TODO switch from mock api
    const lookup = {
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

    return lookup[collateralTickerName];
}
