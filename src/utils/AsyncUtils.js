/**
 * Helper functions with regard to async code.
 */
export function timeout (time_ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), time_ms);
    });
}