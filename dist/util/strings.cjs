"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTitleCase = exports.historyToString = exports.stringFormat = exports.cleanString = exports.truncateCenterString = void 0;
function truncateCenterString(fullStr, strLen, separator) {
    if (fullStr.length <= strLen)
        return fullStr;
    separator = separator || '...';
    var sepLen = separator.length, charsToShow = strLen - sepLen, frontChars = Math.ceil(charsToShow / 2), backChars = Math.floor(charsToShow / 2);
    return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
}
exports.truncateCenterString = truncateCenterString;
function cleanString(text) {
    text = text.replace(/\\/g, '');
    text = text.replace(/#/g, ' ');
    text = text.replace(/\. \./g, '.');
    text = text.replace(/\s\s+/g, ' ');
    text = text.replace(/(\r\n|\n|\r)/gm, ' ');
    return text.trim();
}
exports.cleanString = cleanString;
function stringFormat(template, ...args) {
    return template.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
}
exports.stringFormat = stringFormat;
function historyToString(history) {
    return history.reduce((p, c) => {
        return p.concat(`${c.sender}: ${c.message}`);
    }, '');
}
exports.historyToString = historyToString;
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
exports.toTitleCase = toTitleCase;
