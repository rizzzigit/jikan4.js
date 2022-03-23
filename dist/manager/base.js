"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseManager = void 0;
const tslib_1 = require("tslib");
const base_1 = require("../resource/base");
class BaseManager extends base_1.BaseClass {
    constructor(client) {
        super(client);
        this.APIClient = client.APIClient;
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    debug(message) {
        this.client.debug('Content Manager', message);
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    request(path, query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.debug(`Get content ${path}`);
            const responseData = yield this.APIClient.request({ path, query });
            switch (responseData.status) {
                case 418: return null;
                case 200: return responseData.body.data;
                default: return undefined;
            }
        });
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    requestPaginated(path, offset = 0, maxCount = this.client.options.dataPaginationMaxSize, query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const data = [];
            const maxCountValid = maxCount > 0;
            const fetchEnd = () => maxCountValid ? offset + maxCount : undefined;
            let page = 0;
            let is200 = true;
            let hasNext = true;
            let lastPage = null;
            do {
                page++;
                this.debug(`Get content ${path} page #${page}${lastPage !== null ? ` of ${lastPage}` : ''}`);
                const responseData = yield this.APIClient.request({ path, query: Object.assign(Object.assign({}, query), { page: `${page}` }) });
                const { pagination, body, status } = responseData;
                is200 = status === 200;
                if (Array.isArray(body.data)) {
                    data.push(...body.data);
                    hasNext = (pagination === null || pagination === void 0 ? void 0 : pagination.hasNext) || false;
                    lastPage = (pagination === null || pagination === void 0 ? void 0 : pagination.last) || 0;
                }
                const end = fetchEnd();
                if (end && (data.length > end)) {
                    break;
                }
            } while (is200 && hasNext);
            return data.length || is200 ? data.slice(offset, fetchEnd()) : undefined;
        });
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    storeCache(requestData, body) {
        var _a;
        if ((requestData.cache !== undefined) ? requestData.cache : true) {
            return body;
        }
        return ((_a = this.APIClient.cache) === null || _a === void 0 ? void 0 : _a.set(requestData, body)) || body;
    }
}
exports.BaseManager = BaseManager;
