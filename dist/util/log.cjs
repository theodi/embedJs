"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepLog = void 0;
const util_1 = __importDefault(require("util"));
function deepLog(obj) {
    console.log(util_1.default.inspect(obj, { depth: null, colors: true, sorted: true, compact: false }));
}
exports.deepLog = deepLog;
