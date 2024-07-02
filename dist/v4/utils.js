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
exports.sleep = sleep;
exports.waitUntil = waitUntil;
exports.translateObject = translateObject;
function sleep(time) {
    return __awaiter(this, void 0, void 0, function* () { return yield new Promise((resolve) => setTimeout(resolve, time)); });
}
function waitUntil(time) {
    return __awaiter(this, void 0, void 0, function* () {
        const now = Date.now();
        if (time > now) {
            yield sleep(time - now);
        }
    });
}
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
