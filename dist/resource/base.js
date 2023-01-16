"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseResource = exports.BaseClass = void 0;
class BaseClass {
    constructor(client) {
        this.client = client;
        Object.defineProperty(this, 'client', { enumerable: false, value: client });
    }
    static parseDate(input, nullable = false) {
        const date = new Date(input || '');
        if (Number.isNaN(date.getTime())) {
            if (nullable) {
                return null;
            }
            else {
                throw new Error('Invalid date');
            }
        }
        return date;
    }
    static parseURL(input, nullable = false) {
        let url = null;
        try {
            if (input) {
                url = new URL(input);
            }
        }
        catch (error) {
        }
        if (!url) {
            if (nullable) {
                return null;
            }
            else {
                throw new Error(`Invalid URL: ${input}`);
            }
        }
        else {
            return url;
        }
    }
}
exports.BaseClass = BaseClass;
class BaseResource extends BaseClass {
    constructor(client, data) {
        super(client);
        this.id = data.mal_id;
        this.url = BaseResource.parseURL(data.url);
    }
}
exports.BaseResource = BaseResource;
