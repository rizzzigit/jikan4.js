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
exports.ProducerManager = void 0;
const producer_1 = require("../resource/producer");
const base_1 = require("./base");
class ProducerManager extends base_1.BaseManager {
    list(offset, maxCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseData = yield this.requestPaginated('producers', offset, maxCount);
            return responseData.map((data) => new producer_1.Producer(this.client, data));
        });
    }
    get(producerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`producers/${producerId}`);
            return rawData ? new producer_1.Producer(this.client, rawData) : undefined;
        });
    }
    getFull(producerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`producers/${producerId}/full`);
            return rawData ? new producer_1.ProducerFull(this.client, rawData) : undefined;
        });
    }
    getExternal(producerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`producers/${producerId}/external`);
            return rawData ? rawData.map((entry) => Object.assign(entry, { url: new URL(entry.url) })) : undefined;
        });
    }
}
exports.ProducerManager = ProducerManager;
