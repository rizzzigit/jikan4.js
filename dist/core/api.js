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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIClient = exports.APIError = exports.APIResponseData = void 0;
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils");
const cache_1 = require("./cache");
const isBrowser = typeof window !== 'undefined';
class APIResponseData {
    static parsePagination(url, paginationData) {
        const current = Number(url.searchParams.get('page')) || 1;
        const last = (paginationData === null || paginationData === void 0 ? void 0 : paginationData.last_visible_page) || 1;
        const hasNext = (paginationData === null || paginationData === void 0 ? void 0 : paginationData.has_next_page) || false;
        return { current, last, hasNext };
    }
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
        const { options: { disableCaching, dataPath } } = client;
        this.cache = (!disableCaching) && (dataPath != null)
            ? new cache_1.CacheManager(client)
            : undefined;
        this.lastRequest = 0;
        this.isQueueRunning = false;
        this.agent = isBrowser
            ? {}
            : (() => {
                const { options: { keepAlive, keepAliveMsecs } } = client;
                const options = { keepAlive, keepAliveMsecs };
                return {
                    http: new http_1.default.Agent(options),
                    https: new https_1.default.Agent(options)
                };
            })();
    }
    /** @hidden */
    newRequestInstance(secure, url, options) {
        const { agent } = this;
        if (secure) {
            return https_1.default.request(url.toString(), Object.assign(Object.assign({}, options), { agent: agent.https }));
        }
        return http_1.default.request(url.toString(), Object.assign(Object.assign({}, options), { agent: agent.http }));
    }
    /** @hidden */
    get nextRequest() {
        const { client: { options: { dataRateLimit } }, lastRequest } = this;
        return lastRequest + dataRateLimit;
    }
    /** @hidden */
    awaitNextRequest() {
        return __awaiter(this, void 0, void 0, function* () {
            const { nextRequest } = this;
            if (nextRequest > Date.now()) {
                this.debug(`Wait ${nextRequest - Date.now()} ms before requesting`);
                yield (0, utils_1.waitUntil)(nextRequest);
            }
        });
    }
    /** @hidden */
    runQueue() {
        return __awaiter(this, void 0, void 0, function* () {
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
                        const { path, query } = requestData;
                        for (let queueIndex = 0; queue.length > queueIndex; queueIndex++) {
                            const otherEntry = queue[queueIndex];
                            if (!otherEntry.requestData.cache) {
                                continue;
                            }
                            const { requestData: { path: otherPath, query: otherQuery }, resolve: otherResolve } = otherEntry;
                            if (JSON.stringify([otherPath, otherQuery]) === JSON.stringify([path, query])) {
                                queue.splice(queueIndex--, 1);
                                otherResolve(responseData);
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
    /** @hidden */
    addQueue(requestData, resolve, reject) {
        const { queue } = this;
        queue.push({ requestData, resolve, reject });
        this.debug(`Queue size update: ${queue.length}`);
        if (!this.isQueueRunning) {
            this.runQueue();
        }
    }
    /** @hidden */
    debug(message) {
        return this.client.debug('API Client', message);
    }
    constructURL(requestData) {
        const { client: { options: { host, baseUri, secure } } } = this;
        const { path, query } = requestData;
        const url = new URL(`http${secure ? 's' : ''}://${host}${((path) => `${path.startsWith('/') ? '' : '/'}${path}`)(isBrowser ? `${baseUri}/${path}` : path_1.default.join(baseUri, path))}`);
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
        return __awaiter(this, void 0, void 0, function* () {
            const { cache } = this;
            if ((requestData.cache !== undefined ? requestData.cache : true) && (cache === null || cache === void 0 ? void 0 : cache.has(requestData))) {
                return cache.get(requestData);
            }
            return yield new Promise((resolve, reject) => this.addQueue(requestData, resolve, reject));
        });
    }
    /** @hidden */
    execReqeust(requestData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { client: { options: { secure, requestTimeout, maxApiErrorRetry, retryOnApiError } }, cache } = this;
            const url = this.constructURL(requestData);
            const cachingEnabled = requestData.cache !== undefined ? requestData.cache : true;
            const processResponse = (responseData, resolve, reject) => {
                if ([418, 200, 404].includes(responseData.status)) {
                    if (cachingEnabled) {
                        cache === null || cache === void 0 ? void 0 : cache.set(requestData, responseData);
                    }
                    resolve(responseData);
                }
                else if (responseData.status === 429) {
                    reject(new APIError(Object.assign(responseData, {
                        body: Object.assign(responseData.body, {
                            error: 'Rate limited'
                        })
                    })));
                }
                else {
                    reject(new APIError(responseData));
                }
            };
            const run = () => new Promise((resolve, reject) => {
                if (cachingEnabled && (cache === null || cache === void 0 ? void 0 : cache.has(requestData))) {
                    return cache.get(requestData);
                }
                this.lastRequest = Date.now();
                this.debug(`HTTP GET ${url}`);
                const request = this.newRequestInstance(secure, url, { timeout: requestTimeout });
                request.on('error', reject);
                request.on('timeout', () => request.destroy(new Error(`${requestTimeout} ms timeout`)));
                request.on('response', (response) => { var _a, response_1, response_1_1; return __awaiter(this, void 0, void 0, function* () {
                    var _b, e_1, _c, _d;
                    response.on('error', reject);
                    const bufferSink = [];
                    try {
                        for (_a = true, response_1 = __asyncValues(response); response_1_1 = yield response_1.next(), _b = response_1_1.done, !_b;) {
                            _d = response_1_1.value;
                            _a = false;
                            try {
                                const buffer = _d;
                                bufferSink.push(buffer);
                            }
                            finally {
                                _a = true;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (!_a && !_b && (_c = response_1.return)) yield _c.call(response_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    const body = JSON.parse(Buffer.concat(bufferSink).toString('utf-8'));
                    const responseData = new APIResponseData(Number(body.status || response.statusCode), url, response.headers, body);
                    processResponse(responseData, resolve, reject);
                }); });
                request.end();
            });
            const runBrowser = () => new Promise((resolve, reject) => {
                this.lastRequest = Date.now();
                this.debug(`HTTP GET ${url}`);
                const request = new XMLHttpRequest();
                request.open('GET', url);
                request.timeout = requestTimeout;
                request.onerror = () => { };
                request.ontimeout = () => reject(new Error(`${requestTimeout} ms timeout`));
                request.onloadend = () => {
                    const body = JSON.parse(request.responseText);
                    const responseData = new APIResponseData(Number(body.status || request.status), url, (() => {
                        const data = {};
                        for (const entry of request.getAllResponseHeaders().split('\n')) {
                            const [name, ...value] = entry.trim().split(':');
                            data[name.trim()] = value.join(':').trim();
                        }
                        return data;
                    })(), body);
                    processResponse(responseData, resolve, reject);
                };
                request.send(null);
            });
            return yield new Promise((resolve, reject) => {
                let retry = 0;
                const exec = () => __awaiter(this, void 0, void 0, function* () {
                    yield this.awaitNextRequest();
                    yield (isBrowser ? runBrowser() : run())
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
