import moment from 'moment';
import { QueryGranularity } from 'model';

export function numberShort (num) {
    if (num == null) return "-";

    const digits = 1;
    var si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "K" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "B" },
        { value: 1E12, symbol: "T" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

export function percent (num) {
    if (num == null || num === 0) return "-";

    return (num*100).toFixed(2) + "%";
}

export function dateLong (date = moment()) {
    return date.format('dddd DD MMM. YYYY');
}

export function dateWithGranularity (date, granularity) {
    return date.format(getFormatFromGranularity(granularity));
}

export function getFormatFromGranularity (granularity) {
    switch (granularity) {
        case QueryGranularity.HOUR: return "DD MMM. YYYY HH:00";
        case QueryGranularity.DAY: return "DD MMM. YYYY";
        case QueryGranularity.WEEK: return "[Week] W YYYY";
        case QueryGranularity.MONTH: return "MMM. YYYY";
        case QueryGranularity.YEAR: return "YYYY";
        default: return null;
    }
}

/**
 * Google Charts uses a slightly different format from moment. Do conversion here.
 */
export function toGoogleChartsDateFormat (format) {
    return format.replace(/DD/g, "dd");
}