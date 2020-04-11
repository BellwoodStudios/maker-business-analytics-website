import BigNumber from 'bignumber.js';

BigNumber.config({ POW_PRECISION: 100 });

/**
 * Convert the fixed point per-second fee number to the APY value.
 */
export function feeToAPY (fee) {
    return new BigNumber(fee).dividedBy(10e26).exponentiatedBy(31536000).plus(-1).decimalPlaces(10).toNumber();
}