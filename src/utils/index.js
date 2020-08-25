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

/**
 * Average the values of an array.
 */
export function arrayAvg (arr) {
    let value = 0;
    for (const v of arr) value += v;
    return value / arr.length;
}

/**
 * Flip an array of arrays so the vertical values become horizontal. Think of it like a matrix transpose.
 */
export function transpose (arrays) {
    return arrays[0].map(function(_,i){
        return arrays.map(function(array){return array[i]})
    });
}

/**
 * Convert the nicely formatted data to a 2D array.
 */
export function toDataArray (activeStats, data) {
    if (data.length === 0) return null;

    // Merge packed stats together
    const packedData = data.map(sd => sd.packedData);
    const merged = [];
    for (let i = 0; i < packedData[0].length; i++) {
        merged.push([
            packedData[0][i].timestamp.toDate(),
            ...packedData.map(d => d[i].value)
        ]);
    }

    return [
        ["Date", ...activeStats.map(s => s.getLongName())],
        ...merged
    ];
}

/**
 * Trigger a client-side text file download.
 */
export function download (filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}