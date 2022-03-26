"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIClient = exports.APIError = exports.APIResponseData = void 0;
const tslib_1 = require("tslib");
const http_1 = (0, tslib_1.__importDefault)(require("http"));
const https_1 = (0, tslib_1.__importDefault)(require("https"));
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const url_1 = require("url");
const utils_1 = require("../utils");
const cache_1 = require("./cache");
class APIResponseData {
    constructor(status, url, headers, body) {
        this.time = Date.now();
        this.url = `${url.href}`;
        this.status = status || 200;
        this.headers = headers;
        this.body = body;
        this.pagination = (body === null || body === void 0 ? void 0 : body.pagination)
            ? APIResponseData.parsePagination(url, body.pagination)
            : undefined;
    }
    static parsePagination(url, paginationData) {
        const current = Number(url.searchParams.get('page')) || 1;
        const last = (paginationData === null || paginationData === void 0 ? void 0 : paginationData.last_visible_page) || 1;
        const hasNext = (paginationData === null || paginationData === void 0 ? void 0 : paginationData.has_next_page) || false;
        return { current, last, hasNext };
    }
}
exports.APIResponseData = APIResponseData;
class APIError extends Error {
    constructor(response) {
        const { status, url: referenceUrl, body: { type, message, error, trace, report_url: reportUrl } } = response;
        if (!error) {
            throw new Error('Invalid error data');
        }
        super(`HTTP ${status} Hit: ${message}`);
        this.status = status;
        this.errorType = type;
        this.error = error;
        this.trace = trace;
        this.reportUrl = reportUrl;
        this.referenceUrl = referenceUrl;
        this.response = response;
    }
}
exports.APIError = APIError;
class APIClient {
    constructor(client) {
        this.client = client;
        this.queue = [];
        this.cache = !client.options.disableCaching
            ? new cache_1.CacheManager(client)
            : undefined;
        this.lastRequest = 0;
        this.isQueueRunning = false;
        this.agent = (() => {
            const { options: { keepAlive, keepAliveMsecs } } = client;
            const options = { keepAlive, keepAliveMsecs };
            return {
                http: new http_1.default.Agent(options),
                https: new https_1.default.Agent(options)
            };
        })();
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    newRequestInstance(secure, url, options) {
        const { agent } = this;
        if (secure) {
            return https_1.default.request(url, Object.assign(Object.assign({}, options), { agent: agent.https }));
        }
        return http_1.default.request(url, Object.assign(Object.assign({}, options), { agent: agent.http }));
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    get nextRequest() {
        const { client: { options: { dataRateLimit } }, lastRequest } = this;
        return lastRequest + dataRateLimit;
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    awaitNextRequest() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const { nextRequest } = this;
            if (nextRequest > Date.now()) {
                this.debug(`Wait ${nextRequest - Date.now()} ms before requesting`);
                yield (0, utils_1.waitUntil)(nextRequest);
            }
        });
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    runQueue() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (this.isQueueRunning) {
                return;
            }
            this.isQueueRunning = true;
            try {
                const { queue } = this;
                while (queue.length) {
                    const entry = queue.shift();
                    this.debug(`Queue size update: ${queue.length}`);
                    const { requestData, resolve, reject } = entry;
                    try {
                        const responseData = yield this.execReqeust(requestData);
                        for (let queueIndex = 0; queue.length > queueIndex; queueIndex++) {
                            const otherEntry = queue[queueIndex];
                            const { requestData: { path: otherPath, query: otherQuery } } = otherEntry;
                            const { path, query } = requestData;
                            if (JSON.stringify([otherPath, otherQuery]) === JSON.stringify([path, query])) {
                                queue.splice(queueIndex--, 1);
                                resolve(responseData);
                            }
                        }
                        resolve(responseData);
                    }
                    catch (error) {
                        reject(error);
                    }
                }
            }
            finally {
                this.isQueueRunning = false;
            }
        });
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    addQueue(requestData, resolve, reject) {
        const { queue } = this;
        queue.push({ requestData, resolve, reject });
        this.debug(`Queue size update: ${queue.length}`);
        if (!this.isQueueRunning) {
            this.runQueue();
        }
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    debug(message) {
        return this.client.debug('API Client', message);
    }
    constructURL(requestData) {
        const { client: { options: { host, baseUri, secure } } } = this;
        const { path, query } = requestData;
        const url = new url_1.URL(`http${secure ? 's' : ''}://${host}${((path) => `${path.startsWith('/') ? '' : '/'}${path}`)(path_1.default.join(baseUri, path))}`);
        const { searchParams } = url;
        if (query) {
            for (const queryKey in query) {
                const { [queryKey]: queryEntry } = query;
                if (queryEntry) {
                    searchParams.set(queryKey, queryEntry);
                }
            }
        }
        return url;
    }
    request(requestData) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const { cache } = this;
            if ((requestData.cache !== undefined ? requestData.cache : true) && (cache === null || cache === void 0 ? void 0 : cache.has(requestData))) {
                return cache.get(requestData);
            }
            return yield new Promise((resolve, reject) => this.addQueue(requestData, resolve, reject));
        });
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    execReqeust(requestData) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const { client: { options: { secure, requestTimeout, maxApiErrorRetry, retryOnApiError } }, cache } = this;
            const url = this.constructURL(requestData);
            const cachingEnabled = requestData.cache !== undefined ? requestData.cache : true;
            const run = () => new Promise((resolve, reject) => {
                if (cachingEnabled && (cache === null || cache === void 0 ? void 0 : cache.has(requestData))) {
                    return cache.get(requestData);
                }
                this.lastRequest = Date.now();
                this.debug(`HTTP GET ${url}`);
                const request = this.newRequestInstance(secure, url, { timeout: requestTimeout });
                request.on('error', reject);
                request.on('timeout', () => request.destroy(new Error(`${requestTimeout} ms timeout`)));
                request.on('response', (response) => { var response_1, response_1_1; return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
                    var e_1, _a;
                    response.on('error', reject);
                    let bufferSink = Buffer.alloc(0);
                    try {
                        for (response_1 = (0, tslib_1.__asyncValues)(response); response_1_1 = yield response_1.next(), !response_1_1.done;) {
                            const buffer = response_1_1.value;
                            bufferSink = Buffer.concat([bufferSink, buffer]);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (response_1_1 && !response_1_1.done && (_a = response_1.return)) yield _a.call(response_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    const body = JSON.parse(bufferSink.toString('utf-8'));
                    const responseData = new APIResponseData(body.status || response.statusCode, url, response.headers, body);
                    if ([418, 200, 404].includes(responseData.status)) {
                        if (cachingEnabled) {
                            cache === null || cache === void 0 ? void 0 : cache.set(requestData, responseData);
                        }
                        resolve(responseData);
                    }
                    else {
                        reject(new APIError(responseData));
                    }
                }); });
                request.end();
            });
            return new Promise((resolve, reject) => {
                let retry = 0;
                const exec = () => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
                    yield this.awaitNextRequest();
                    yield run()
                        .then(resolve)
                        .catch((error) => {
                        if (!(retryOnApiError &&
                            (retry <= maxApiErrorRetry) &&
                            (error.response
                                ? ((error.response.status >= 500) &&
                                    (error.response.status < 600))
                                : true))) {
                            reject(error);
                        }
                        else {
                            retry++;
                            exec();
                        }
                    });
                });
                exec();
            });
        });
    }
}
exports.APIClient = APIClient;
