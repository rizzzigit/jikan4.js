"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIClient = exports.APIError = exports.APIRequestQueue = exports.APIResponseData = void 0;
const tslib_1 = require("tslib");
const url_1 = require("url");
const utils_1 = require("../utils");
const http_1 = (0, tslib_1.__importDefault)(require("http"));
const https_1 = (0, tslib_1.__importDefault)(require("https"));
const cache_1 = require("./cache");
class APIResponseData {
    constructor(status, url, headers, data) {
        this.date = Date.now();
        this.status = status || 200;
        this.headers = headers;
        if (this.status === 200) {
            if (data === null || data === void 0 ? void 0 : data.data) {
                this.pagination = data.pagination ? APIResponseData.parsePagination(url, data.pagination) : undefined;
                this.data = data === null || data === void 0 ? void 0 : data.data;
            }
            else {
                this.data = data;
            }
        }
        else if (this.status === 500) {
            this.data = data;
        }
    }
    static parsePagination(url, paginationData) {
        const current = Number(url.searchParams.get('page')) || 1;
        const last = (paginationData === null || paginationData === void 0 ? void 0 : paginationData.last_visible_page) || 1;
        const hasNext = (paginationData === null || paginationData === void 0 ? void 0 : paginationData.has_next_page) || false;
        return { current, last, hasNext };
    }
}
exports.APIResponseData = APIResponseData;
class APIRequestQueue extends Array {
    constructor(APIClient) {
        super();
        this.APIClient = APIClient;
        this.client = APIClient.client;
        this.isRunning = false;
        this.lastRequest = 0;
        this.warningEmitted = false;
    }
    get nextRequest() {
        return this.lastRequest + this.APIClient.client.options.dataRateLimit;
    }
    debug(message) {
        this.APIClient.client.debug('Request Queue', message);
    }
    runQueue() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            this.debug('Run request queue');
            this.isRunning = true;
            do {
                const entry = this.shift();
                if (entry) {
                    this.debug(`Shift one entry from the queue, new queue size is ${this.length}`);
                    yield this.APIClient.executeRequest(entry.url)
                        .then(entry.resolve)
                        .catch(entry.reject);
                }
                else {
                    this.debug('Queue is now empty');
                    this.isRunning = false;
                }
            } while (this.isRunning);
            this.debug('Request queue done');
        });
    }
    push(queueEntry) {
        const { client: { options: { requestQueueLimit } } } = this;
        if (requestQueueLimit && (requestQueueLimit <= this.length)) {
            throw new Error(`Request queue has reached the limit (${requestQueueLimit})`);
        }
        super.push(queueEntry);
        this.debug(`Add new queue entry: ${queueEntry.url}, new queue size is ${this.length}`);
        if (!this.isRunning) {
            this.runQueue();
        }
        return this.length;
    }
}
exports.APIRequestQueue = APIRequestQueue;
class APIError extends Error {
    constructor(message, referenceURL, errorData) {
        super(message);
        this.status = errorData.status;
        this.errorType = errorData.type;
        this.error = errorData.error;
        this.trace = errorData.trace;
        this.reportURL = errorData.report_url;
        this.referenceURL = referenceURL;
    }
}
exports.APIError = APIError;
class APIClient {
    constructor(client) {
        this.client = client;
        this.queue = new APIRequestQueue(this);
        this.cacheManager = new cache_1.CacheManager(client);
    }
    parseURL(path, query) {
        const { client: { options } } = this;
        if (!path) {
            path = '';
        }
        const parsedURL = new url_1.URL(`http${options.secure ? 's' : ''}://${options.host}/${options.baseURI}${path.length ? '/' : ''}${path}`);
        if (query) {
            const params = parsedURL.searchParams;
            for (const queryKey in query) {
                const queryEntry = query[queryKey];
                if (queryEntry !== undefined) {
                    params.set(queryKey, queryEntry);
                }
            }
        }
        return parsedURL;
    }
    debug(message) {
        return this.client.debug('API Client', message);
    }
    request(path, query) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const { cacheManager } = this;
            const url = this.parseURL(path, query);
            if (this.isCachingEnabled(url) && cacheManager.has(url)) {
                return cacheManager.get(url);
            }
            return yield new Promise((resolve, reject) => this.queue.push({
                url, resolve, reject
            }));
        });
    }
    isCachingEnabled(url) {
        return !(this.client.options.disableCaching || url.searchParams.has('disableCaching'));
    }
    executeRequest(url) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const { client: { options }, cacheManager } = this;
            const isCachingEnabled = this.isCachingEnabled(url);
            if (isCachingEnabled && cacheManager.has(url)) {
                return cacheManager.get(url);
            }
            if (this.queue.nextRequest > Date.now()) {
                this.debug(`Wait ${this.queue.nextRequest - Date.now()} ms before requesting`);
                yield (0, utils_1.waitUntil)(this.queue.nextRequest);
            }
            this.queue.lastRequest = Date.now();
            const responseData = yield new Promise((resolve, reject) => {
                const callREST = () => new Promise((resolve, reject) => {
                    const request = (url.protocol === 'https:' ? https_1.default : http_1.default).request(`${url}`);
                    const requestTimeout = () => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
                        var _a;
                        yield (0, utils_1.sleep)(options.requestTimeout);
                        if (!(request.destroyed || ((_a = request.socket) === null || _a === void 0 ? void 0 : _a.destroyed))) {
                            request.destroy(new Error(`${options.requestTimeout} ms timeout`));
                        }
                    });
                    request.on('error', reject);
                    request.on('response', (response) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
                        let responseText = '';
                        response.on('error', reject);
                        response.on('data', (chunk) => (responseText += chunk));
                        response.on('end', () => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
                            const deserialized = yield (() => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () { return JSON.parse(responseText); }))().catch(() => ({}));
                            deserialized.status = !deserialized.status ? response.statusCode : deserialized.status;
                            resolve(new APIResponseData(deserialized.status, url, response.headers, deserialized));
                        }));
                    }));
                    requestTimeout();
                    this.debug(`HTTP GET ${url}`);
                    request.end();
                });
                callREST()
                    .then((response) => {
                    switch (response.status) {
                        case 418:
                        case 200:
                        case 404:
                            resolve(response);
                            break;
                        default:
                            reject(new APIError(`HTTP ${response.status} hit on ${url}`, `${url}`, response.data || {}));
                    }
                })
                    .catch(reject);
            });
            if (isCachingEnabled) {
                cacheManager.set(url, responseData);
            }
            return responseData;
        });
    }
}
exports.APIClient = APIClient;
