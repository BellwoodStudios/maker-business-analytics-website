import BigNumber from 'bignumber.js';

BigNumber.config({ POW_PRECISION: 100 });

/**
 * Convert the fixed point per-second fee number to the APY value.
 */
export function feeToAPY (fee) {
    return new BigNumber(fee).dividedBy(10e26).exponentiatedBy(31536000).plus(-1).decimalPlaces(10).toNumber();
}

export function sumFees (fee1, fee2) {
    return new BigNumber(fee1).plus(fee2);
}

export function fromWad (wadAmount) {
    return new BigNumber(wadAmount).dividedBy(1e18).toNumber();
}

export function fromRay (rayAmount) {
    return new BigNumber(rayAmount).dividedBy(1e27).toNumber();
}

export function fromRad (radAmount) {
    return new BigNumber(radAmount).dividedBy(1e45).toNumber();
}

/**
 * Convert the ilk spot price to the actual collateral value in USD.
 */
export function ilkSpotToPrice (_spot, _mat) {
    const spot = new BigNumber(fromRay(_spot));
    const mat = new BigNumber(fromRay(_mat));
    return spot.multipliedBy(mat).toNumber();
}

/**
 * Convert normalized Dai (art) into the actual amount.
 */
export function parseDaiSupply (_art, _rate) {
    const art = new BigNumber(fromWad(_art));
    const rate = new BigNumber(_rate != null ? fromRay(_rate) : 1);
    return art.multipliedBy(rate).toNumber();
}

/**
 * Deteremine the fees that were collected over some time period.
 */
export function parseFeesCollected (_art1, _art2, _rate1, _rate2) {
    if (_art1 == null) _art1 = _art2;
    if (_rate1 == null) _rate1 = _rate2;

    const art1 = new BigNumber(fromWad(_art1));
    const art2 = new BigNumber(fromWad(_art2));
    const rate1 = new BigNumber(_rate1 != null ? fromRay(_rate1) : 1);
    const rate2 = new BigNumber(_rate2 != null ? fromRay(_rate2) : 1);
    return (art1.plus(art2).dividedBy(2)).multipliedBy(rate2.minus(rate1)).toNumber();
}