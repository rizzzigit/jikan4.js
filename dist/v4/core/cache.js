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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _CacheManager_fs;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheManager = void 0;
const path_1 = require("path");
class CacheManager {
    /** @hidden */
    fs() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (__classPrivateFieldGet(this, _CacheManager_fs, "f") === undefined && typeof process !== 'undefined' && typeof window === 'undefined') {
                try {
                    __classPrivateFieldSet(this, _CacheManager_fs, require('fs'), "f");
                }
                catch (_b) {
                    __classPrivateFieldSet(this, _CacheManager_fs, null, "f");
                }
            }
            return (_a = __classPrivateFieldGet(this, _CacheManager_fs, "f")) !== null && _a !== void 0 ? _a : null;
        });
    }
    /** @hidden */
    get cacheDir() {
        const { client: { options: { dataPath } } } = this;
        if (dataPath == null) {
            throw new Error('client.options.dataPath is not set');
        }
        return (0, path_1.join)(dataPath, 'cache');
    }
    /** @hidden */
    file(path, query) {
        const pathArray = [this.cacheDir, path];
        const url = new URL(`https://asd${path || '/'}`);
        const { searchParams } = url;
        if (query) {
            for (const queryKey in query) {
                const { [queryKey]: queryEntry } = query;
                if (queryEntry) {
                    searchParams.set(queryKey, queryEntry);
                }
            }
        }
        const { search } = url;
        if (search.length) {
            pathArray.push(`_q_${Buffer.from(search).toString('hex')}`);
        }
        return `${(0, path_1.join)(...pathArray)}.json`;
    }
    /** @hidden */
    isExpired(date) {
        const { client: { options } } = this;
        return (date + options.dataExpiry) < Date.now();
    }
    get(requestData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { path, query } = requestData;
            const file = this.file(path, query);
            const fs = yield this.fs();
            if (fs && fs.existsSync(file)) {
                const fileContents = JSON.parse(`${yield fs.promises.readFile(file)}`);
                if (!this.isExpired(fileContents.date)) {
                    return fileContents.data;
                }
            }
        });
    }
    set(requestData, rawData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { path, query } = requestData;
            const file = this.file(path, query);
            if (rawData) {
                const data = {
                    data: rawData,
                    date: Date.now()
                };
                const fs = yield this.fs();
                if (fs) {
                    const baseFile = (0, path_1.dirname)(file);
                    if (!fs.existsSync(baseFile)) {
                        yield fs.promises.mkdir(baseFile, { recursive: true });
                    }
                    yield fs.promises.writeFile(file, JSON.stringify(data, undefined, '  '));
                }
            }
            return rawData;
        });
    }
    has(requestData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { path, query } = requestData;
            const file = this.file(path, query);
            const fs = yield this.fs();
            if (fs && fs.existsSync(file)) {
                const data = JSON.parse(`${yield fs.promises.readFile(file)}`);
                return !this.isExpired(data.date);
            }
            return false;
        });
    }
    delete(requestData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { path, query } = requestData;
            const file = this.file(path, query);
            const fs = yield this.fs();
            if (fs) {
                if (fs.existsSync(file)) {
                    yield fs.promises.unlink(file);
                }
            }
        });
    }
    default(requestData, rawData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { path, query } = requestData;
            const file = this.file(path, query);
            const fs = yield this.fs();
            if (fs) {
                if (fs.existsSync(file)) {
                    const data = JSON.parse(`${fs.promises.readFile(file)}`);
                    if (!this.isExpired(data.date)) {
                        return data.data;
                    }
                }
                const data = {
                    data: rawData,
                    date: Date.now()
                };
                fs.promises.writeFile(file, JSON.stringify(data, undefined, '  '));
            }
        });
    }
    constructor(client) {
        _CacheManager_fs.set(this, void 0);
        this.client = client;
    }
}
exports.CacheManager = CacheManager;
_CacheManager_fs = new WeakMap();
