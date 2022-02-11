"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheManager = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
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
    file(url) {
        const path = [this.cacheDir, url.pathname];
        if (url.search.length) {
            path.push(`_q_${Buffer.from(url.search).toString('hex')}`);
        }
        return `${(0, path_1.join)(...path)}.json`;
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    isExpired(date) {
        const { client: { options } } = this;
        return (date + options.dataExpiry) < Date.now();
    }
    get(url) {
        const file = this.file(url);
        if ((0, fs_1.existsSync)(file)) {
            const data = JSON.parse(`${(0, fs_1.readFileSync)(file)}`);
            if (!this.isExpired(data.date)) {
                return data.data;
            }
        }
    }
    set(url, rawData) {
        const file = this.file(url);
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
    has(url) {
        const file = this.file(url);
        if ((0, fs_1.existsSync)(file)) {
            const data = JSON.parse(`${(0, fs_1.readFileSync)(file)}`);
            return !this.isExpired(data.date);
        }
        return false;
    }
    delete(url) {
        const file = this.file(url);
        if ((0, fs_1.existsSync)(file)) {
            (0, fs_1.unlinkSync)(file);
        }
    }
    default(url, rawData) {
        const file = this.file(url);
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
