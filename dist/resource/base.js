"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseResource = exports.BaseClass = void 0;
const url_1 = require("url");
class BaseClass {
    constructor(client) {
        this.client = client;
        Object.defineProperty(this, 'client', { enumerable: false, value: client });
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
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
    // // eslint-disable-next-line tsdoc/syntax
    // /** @hidden */
    // public static parseString<IsNullable extends boolean = false> (input: any, nullable: IsNullable = <any> false): IsNullable extends false ? string : (string | null) {
    //   input = input?.trim()
    //   if (!input) {
    //     if (nullable) {
    //       return <any> null
    //     } else {
    //       throw new Error('Invalid string')
    //     }
    //   } else {
    //     return input
    //   }
    // }
    // // eslint-disable-next-line tsdoc/syntax
    // /** @hidden */
    // public static parseNumber<IsNullable extends boolean = false> (input: any, nullable: IsNullable = <any> false): IsNullable extends false ? number : (number | null) {
    //   const number = Number(input)
    //   if (Number.isNaN(number)) {
    //     if (nullable) {
    //       return <any> null
    //     } else {
    //       throw new Error('Invalid number')
    //     }
    //   } else {
    //     return Number(input)
    //   }
    // }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    static parseURL(input, nullable = false) {
        let url = null;
        try {
            if (input) {
                url = new url_1.URL(input);
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
