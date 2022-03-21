"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheManager = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const url_1 = require("url");
class CacheManager {
    constructor(client) {
        this.client = client;
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    get cacheDir() {
        const { client: { options: { dataPath } } } = this;
        return (0, path_1.join)(dataPath, 'cache');
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    file(path, query) {
        const pathArray = [this.cacheDir, path];
        const url = new url_1.URL(`https://asd${path || '/'}`);
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
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    isExpired(date) {
        const { client: { options } } = this;
        return (date + options.dataExpiry) < Date.now();
    }
    get(requestData) {
        const { path, query } = requestData;
        const file = this.file(path, query);
        if ((0, fs_1.existsSync)(file)) {
            const fileContents = JSON.parse(`${(0, fs_1.readFileSync)(file)}`);
            if (!this.isExpired(fileContents.date)) {
                return fileContents.data;
            }
        }
    }
    set(requestData, rawData) {
        const { path, query } = requestData;
        const file = this.file(path, query);
        if (rawData) {
            const data = {
                data: rawData,
                date: Date.now()
            };
            const baseFile = (0, path_1.dirname)(file);
            if (!(0, fs_1.existsSync)(baseFile)) {
                (0, fs_1.mkdirSync)(baseFile, { recursive: true });
            }
            (0, fs_1.writeFileSync)(file, JSON.stringify(data, undefined, '  '));
        }
        return rawData;
    }
    has(requestData) {
        const { path, query } = requestData;
        const file = this.file(path, query);
        if ((0, fs_1.existsSync)(file)) {
            const data = JSON.parse(`${(0, fs_1.readFileSync)(file)}`);
            return !this.isExpired(data.date);
        }
        return false;
    }
    delete(requestData) {
        const { path, query } = requestData;
        const file = this.file(path, query);
        if ((0, fs_1.existsSync)(file)) {
            (0, fs_1.unlinkSync)(file);
        }
    }
    default(requestData, rawData) {
        const { path, query } = requestData;
        const file = this.file(path, query);
        if ((0, fs_1.existsSync)(file)) {
            const data = JSON.parse(`${(0, fs_1.readFileSync)(file)}`);
            if (!this.isExpired(data.date)) {
                return data.data;
            }
        }
        const data = {
            data: rawData,
            date: Date.now()
        };
        (0, fs_1.writeFileSync)(file, JSON.stringify(data, undefined, '  '));
    }
}
exports.CacheManager = CacheManager;
