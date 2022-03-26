"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateObject = exports.waitUntil = exports.sleep = void 0;
const tslib_1 = require("tslib");
function sleep(time) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () { return yield new Promise((resolve) => setTimeout(resolve, time)); });
}
exports.sleep = sleep;
function waitUntil(time) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const now = Date.now();
        if (time > now) {
            yield sleep(time - now);
        }
    });
}
exports.waitUntil = waitUntil;
function translateObject(obj, translator) {
    const newObj = {};
    for (const objKey in obj) {
        const result = translator(objKey, obj[objKey]);
        if (result) {
            newObj[result[0]] = result[1];
        }
    }
    return newObj;
}
exports.translateObject = translateObject;
