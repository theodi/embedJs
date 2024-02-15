export function truncateCenterString(fullStr, strLen, separator) {
    if (fullStr.length <= strLen)
        return fullStr;
    separator = separator || '...';
    var sepLen = separator.length, charsToShow = strLen - sepLen, frontChars = Math.ceil(charsToShow / 2), backChars = Math.floor(charsToShow / 2);
    return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
}
export function cleanString(text) {
    text = text.replace(/\\/g, '');
    text = text.replace(/#/g, ' ');
    text = text.replace(/\. \./g, '.');
    text = text.replace(/\s\s+/g, ' ');
    text = text.replace(/(\r\n|\n|\r)/gm, ' ');
    return text.trim();
}
export function stringFormat(template, ...args) {
    return template.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
}
export function historyToString(history) {
    return history.reduce((p, c) => {
        return p.concat(`${c.sender}: ${c.message}`);
    }, '');
}
export function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}