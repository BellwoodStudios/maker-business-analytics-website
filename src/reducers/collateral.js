function collateral (state, action) {
    return {
        loading: false,
        types: [
            { name:"Ethereum", ticker:"ETH" },
            { name:"Basic Attention Token", ticker:"BAT" },
            { name:"USDC", ticker:"USDC" }
        ]
    };
}

export default collateral;