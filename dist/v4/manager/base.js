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
exports.BaseManager = void 0;
const base_1 = require("../resource/base");
class BaseManager extends base_1.BaseClass {
    /** @hidden */
    debug(message) {
        this.client.debug('Content Manager', message);
    }
    /** @hidden */
    request(path, query) {
        return __awaiter(this, void 0, void 0, function* () {
            this.debug(`Get content ${path}`);
            const responseData = yield this.APIClient.request({ path, cache: query ? !('disableCaching' in query) : true, query });
            switch (responseData.status) {
                case 418: return null;
                case 200: return responseData.body.data;
                default: return undefined;
            }
        });
    }
    /** @hidden */
    requestPaginated(path, offset = 0, maxCount = this.client.options.dataPaginationMaxSize, query) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const responseData = yield this.APIClient.request({ path, cache: query ? !('disableCaching' in query) : true, query: Object.assign(Object.assign({}, query), { page: `${page}` }) });
                const { pagination, body, status } = responseData;
                is200 = status === 200;
                if (Array.isArray(body.data)) {
                    data.push(...body.data);
                    hasNext = (pagination === null || pagination === void 0 ? void 0 : pagination.hasNext) || false;
                    lastPage = (pagination === null || pagination === void 0 ? void 0 : pagination.last) || 0;
                }
                const end = fetchEnd();
                if (end && (data.length >= end)) {
                    break;
                }
            } while (is200 && hasNext);
            return data.length || is200 ? data.slice(offset, fetchEnd()) : undefined;
        });
    }
    constructor(client) {
        super(client);
        this.APIClient = client.APIClient;
    }
}
exports.BaseManager = BaseManager;
