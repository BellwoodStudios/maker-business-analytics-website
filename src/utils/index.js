/**
 * Check if the value matches the given enum list. Otherwise throw an exception.
 */
export function enumValidValue (enums, name, value) {
    if (!Object.values(enums).includes(value)) throw new Error(`Invalid ${name} of '${value}'.`);
}

/**
 * Return true iff a1 and a2 are structurally the same.
 */
export function arrayEquals (a1, a2) {
    if (a1.length !== a2.length) return false;

    for (let i = 0; i < a1.length; i++) {
        if (a1[i] !== a2[i]) return false;
    }

    return true;
}

/**
 * Sum the values of an array.
 */
export function arraySum (arr) {
    let value = 0;
    for (const v of arr) value += v;
    return value;
}