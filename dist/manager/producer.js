"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProducerManager = void 0;
const tslib_1 = require("tslib");
const meta_1 = require("../resource/meta");
const base_1 = require("./base");
class ProducerManager extends base_1.BaseManager {
    list(offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const responseData = yield this.requestPaginated('producers', offset, maxCount);
            return responseData.map((data) => new meta_1.ProducerMeta(this.client, data));
        });
    }
}
exports.ProducerManager = ProducerManager;
