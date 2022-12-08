"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseResource = exports.BaseClass = void 0;
class BaseClass {
    /** @hidden */
    static parseImage(data) {
        return {
            small: this.parseURL(data === null || data === void 0 ? void 0 : data.small_image_url, true),
            default: this.parseURL(data === null || data === void 0 ? void 0 : data.image_url, true),
            medium: this.parseURL(data === null || data === void 0 ? void 0 : data.medium_image_url, true),
            large: this.parseURL(data === null || data === void 0 ? void 0 : data.large_image_url, true),
            maximum: this.parseURL(data === null || data === void 0 ? void 0 : data.maximum_image_url, true)
        };
    }
    /** @hidden */
    static parseYoutubeVideo(data) {
        return {
            id: data.youtube_id,
            url: `https://youtu.be/${data.youtube_id}`,
            embedUrl: `https://www.youtube.com/embed/${data.youtube_id}`,
            image: this.parseImage(data.images)
        };
    }
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
    /** @hidden */
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
            return url.toString();
        }
    }
    constructor(client) {
        this.client = client;
        Object.defineProperty(this, 'client', { enumerable: false, value: client });
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
