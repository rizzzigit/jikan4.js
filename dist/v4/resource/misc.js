"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeVideo = exports.ImageFormatCollection = exports.Image = void 0;
const base_1 = require("./base");
class Image extends base_1.BaseClass {
    getOrFallback(sizes) {
        for (const sizeEntry of sizes) {
            if (this[sizeEntry] != null) {
                return this[sizeEntry];
            }
        }
        return null;
    }
    constructor(client, data) {
        super(client);
        this.small = Image.parseURL(data === null || data === void 0 ? void 0 : data.small_image_url, true);
        this.default = Image.parseURL(data === null || data === void 0 ? void 0 : data.image_url, true);
        this.medium = Image.parseURL(data === null || data === void 0 ? void 0 : data.medium_image_url, true);
        this.large = Image.parseURL(data === null || data === void 0 ? void 0 : data.large_image_url, true);
        this.maximum = Image.parseURL(data === null || data === void 0 ? void 0 : data.maximum_image_url, true);
    }
}
exports.Image = Image;
class ImageFormatCollection extends base_1.BaseClass {
    getOrFallback(formats, sizes) {
        var _a, _b;
        for (const formatEntry of formats) {
            if (this[formatEntry] != null) {
                if (sizes != null) {
                    return (_b = (_a = this[formatEntry]) === null || _a === void 0 ? void 0 : _a.getOrFallback(sizes)) !== null && _b !== void 0 ? _b : null;
                }
                return this[formatEntry];
            }
        }
        return null;
    }
    constructor(client, data) {
        super(client);
        this.jpg = data.jpg != null ? new Image(client, data.jpg) : null;
        this.webp = data.webp != null ? new Image(client, data.webp) : null;
    }
}
exports.ImageFormatCollection = ImageFormatCollection;
class YoutubeVideo extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.id = data.youtube_id;
        this.url = new URL(`https://youtu.be/${data.youtube_id}`);
        this.embedUrl = new URL(`https://www.youtube.com/embed/${this.id}`);
        this.image = new Image(client, data.images);
    }
}
exports.YoutubeVideo = YoutubeVideo;
