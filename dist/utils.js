"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateObject = exports.waitUntil = exports.sleep = void 0;
function sleep(time) {
    return __awaiter(this, void 0, void 0, function* () { return yield new Promise((resolve) => setTimeout(resolve, time)); });
}
exports.sleep = sleep;
function waitUntil(time) {
    return __awaiter(this, void 0, void 0, function* () {
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
