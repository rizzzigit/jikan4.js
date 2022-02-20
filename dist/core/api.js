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
            const { client: { options: { maxApiErrorRetry, retryOnApiError } } } = this;
            this.debug('Run request queue');
            this.isRunning = true;
            do {
                const entry = this.shift();
                if (entry) {
                    this.debug(`Shift one entry from the queue, new queue size is ${this.length}`);
                    let currentTry = 0;
                    while (currentTry <= maxApiErrorRetry) {
                        try {
                            entry.resolve(yield this.APIClient.executeRequest(entry.url));
                            break;
                        }
                        catch (error) {
                            if (retryOnApiError) {
                                if ((error.status !== 500) || (currentTry >= maxApiErrorRetry)) {
                                    entry.reject(error.status === 500 ? new Error(`${error.message} after ${currentTry} tries`) : error);
                                    break;
                                }
                                else {
                                    this.debug(`${error.message}, retry no. ${currentTry + 1}`);
                                }
                            }
                            else {
                                entry.reject(error);
                                break;
                            }
                        }
                        currentTry++;
                    }
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
    constructor(message, referenceURL, response) {
        super(message);
        this.status = response.data.status;
        this.errorType = response.data.type;
        this.error = response.data.error;
        this.trace = response.data.trace;
        this.reportURL = response.data.report_url;
        this.referenceURL = referenceURL;
    }
}
exports.APIError = APIError;
class APIClient {
    constructor(client) {
        this.client = client;
        this.queue = new APIRequestQueue(this);
        this.cacheManager = new cache_1.CacheManager(client);
        this.agent = ((options) => ({
            http: new http_1.default.Agent(options),
            https: new https_1.default.Agent(options)
        }))({
            keepAlive: client.options.keepAlive,
            keepAliveMsecs: client.options.keepAliveMsecs
        });
    }
    parseURL(path, query) {
        const { client: { options } } = this;
        if (!path) {
            path = '';
        }
        const parsedURL = new url_1.URL(`http${options.secure ? 's' : ''}://${options.host}/${options.baseUri}${path.length ? '/' : ''}${path}`);
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
            const { client: { options }, cacheManager, agent } = this;
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
                const context = {};
                const callREST = () => new Promise((resolve, reject) => {
                    const request = (url.protocol === 'https:' ? https_1.default : http_1.default).request(`${url}`, { agent: (url.protocol === 'https:' ? agent.https : agent.http) });
                    context.request = request;
                    request.on('error', reject);
                    request.on('response', (response) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
                        let responseText = '';
                        context.response = response;
                        response.on('error', reject);
                        response.on('data', (chunk) => (responseText += chunk));
                        response.on('end', () => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
                            const deserialized = yield (() => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () { return JSON.parse(responseText); }))().catch(() => ({}));
                            deserialized.status = !deserialized.status ? response.statusCode : deserialized.status;
                            resolve(new APIResponseData(deserialized.status, url, response.headers, deserialized));
                        }));
                    }));
                    this.debug(`HTTP GET ${url}`);
                    request.end();
                });
                const sleep = () => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
                    return new Promise((resolve) => {
                        context.timeout = Number(setTimeout(resolve, options.requestTimeout));
                    });
                });
                sleep().then(() => {
                    var _a, _b, _c, _d;
                    if (!(((_a = context.request) === null || _a === void 0 ? void 0 : _a.destroyed) || ((_c = (_b = context.request) === null || _b === void 0 ? void 0 : _b.socket) === null || _c === void 0 ? void 0 : _c.destroyed))) {
                        (_d = context.request) === null || _d === void 0 ? void 0 : _d.destroy(new Error(`${options.requestTimeout} ms timeout`));
                    }
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
                            reject(new APIError(`HTTP ${response.status} hit on ${url}`, `${url}`, response));
                    }
                })
                    .catch(reject)
                    .finally(() => (context.timeout !== undefined) && clearTimeout(context.timeout));
            });
            if (isCachingEnabled) {
                cacheManager.set(url, responseData);
            }
            return responseData;
        });
    }
}
exports.APIClient = APIClient;
