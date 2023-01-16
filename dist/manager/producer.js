"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProducerManager = void 0;
const tslib_1 = require("tslib");
const producer_1 = require("../resource/producer");
const base_1 = require("./base");
class ProducerManager extends base_1.BaseManager {
    list(offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const responseData = yield this.requestPaginated('producers', offset, maxCount);
            return responseData.map((data) => new producer_1.Producer(this.client, data));
        });
    }
    get(producerId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`producers/${producerId}`);
            return rawData ? new producer_1.Producer(this.client, rawData) : undefined;
        });
    }
    getFull(producerId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`producers/${producerId}/full`);
            return rawData ? new producer_1.ProducerFull(this.client, rawData) : undefined;
        });
    }
    getExternal(producerId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`producers/${producerId}/external`);
            return rawData ? rawData.map((entry) => Object.assign(entry, { url: new URL(entry.url) })) : undefined;
        });
    }
}
exports.ProducerManager = ProducerManager;
