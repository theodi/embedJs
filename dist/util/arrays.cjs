"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnique = exports.createArrayChunks = exports.filterAsync = exports.mapAsync = void 0;
function mapAsync(array, callbackfn) {
    return Promise.all(array.map(callbackfn));
}
exports.mapAsync = mapAsync;
async function filterAsync(array, callbackfn) {
    const filterMap = await mapAsync(array, callbackfn);
    return array.filter((_value, index) => filterMap[index]);
}
exports.filterAsync = filterAsync;
function createArrayChunks(arr, size) {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_v, i) => arr.slice(i * size, i * size + size));
}
exports.createArrayChunks = createArrayChunks;
function getUnique(array, K) {
    var seen = {};
    return array.filter(function (item) {
        return seen.hasOwnProperty(item[K]()) ? false : (seen[item[K]()] = true);
    });
}
exports.getUnique = getUnique;
