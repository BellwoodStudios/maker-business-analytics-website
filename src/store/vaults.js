function vaults (state, action) {
    return {
        loading: false,
        typesByCollateral: {
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
        }
    };
}

export default vaults;