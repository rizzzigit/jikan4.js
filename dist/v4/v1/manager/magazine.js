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
exports.MagazineManager = void 0;
const meta_1 = require("../resource/meta");
const base_1 = require("./base");
class MagazineManager extends base_1.BaseManager {
    list(offset, maxCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseData = yield this.requestPaginated('magazines', offset, maxCount);
            return responseData.map((data) => new meta_1.MagazineMeta(this.client, data));
        });
    }
}
exports.MagazineManager = MagazineManager;
