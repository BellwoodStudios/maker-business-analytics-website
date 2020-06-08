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
    return new BigNumber(wadAmount).dividedBy(10e17).toNumber();
}

export function fromRay (rayAmount) {
    return new BigNumber(rayAmount).dividedBy(10e26).toNumber();
}

export function fromRad (radAmount) {
    return new BigNumber(radAmount).dividedBy(10e44).toNumber();
}

/**
 * Convert the ilk spot price 
 */
export function ilkSpotToPrice (_spot, _mat) {
    const spot = new BigNumber(fromRay(_spot));
    const mat = new BigNumber(fromRay(_mat));
    return spot.multipliedBy(mat).toNumber();
}