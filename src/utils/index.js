/**
 * Check if the value matches the given enum list. Otherwise throw an exception.
 */
export function enumValidValue (enums, name, value) {
    if (!Object.values(enums).includes(value)) throw new Error(`Invalid ${name} of '${value}'.`);
}