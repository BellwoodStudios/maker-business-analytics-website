import { timeout } from 'utils/AsyncUtils';

/**
 * Get a list of all available collateral types.
 */
export async function getCollateral () {
    await timeout(1000);
    
    // TODO switch from mock api
    return [
        { name:"Ethereum", ticker:"ETH" },
        { name:"Basic Attention Token", ticker:"BAT" },
        { name:"USDC", ticker:"USDC" }
    ];
}

/**
 * Get a list of all vaults with optional collateral filter.
 */
export async function getVaults ({ collateral }) {
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

    return lookup[collateral];
}

/**
 * Get a list of all stats available with optional vault/collateral filters.
 */
export async function getAvailableStats ({ vault, collateral }) {
    await timeout(1000);

    return [
        {
            name: "DAI Supply",
            value: 1280000000,
            checked: true,
            color: "#1AAB9B"
        },
        {
            name: "Stability Fee",
            value: 0.0725,
            checked: true,
            color: "#F4B731"
        },
        {
            name: "Revenue",
            value: 234743,
            checked: false,
            color: "#F4B731"
        },
        {
            name: "Liquidations",
            value: 43,
            checked: false,
            color: "#F4B731"
        },
        {
            name: "Collateral",
            value: 2234945,
            checked: false,
            color: "#F4B731"
        }
    ];
}
