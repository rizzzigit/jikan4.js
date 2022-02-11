"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeVideo = exports.Image = void 0;
const base_1 = require("./base");
const url_1 = require("url");
class Image extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.small = Image.parseURL(data === null || data === void 0 ? void 0 : data.small_image_url, true);
        this.medium = Image.parseURL((data === null || data === void 0 ? void 0 : data.image_url) || (data === null || data === void 0 ? void 0 : data.medium_image_url), true);
        this.large = Image.parseURL((data === null || data === void 0 ? void 0 : data.maximum_image_url) || (data === null || data === void 0 ? void 0 : data.large_image_url), true);
    }
}
exports.Image = Image;
class YoutubeVideo extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.id = data;
        this.url = new url_1.URL(`https://youtu.be/${this.id}`);
        this.embedUrl = new url_1.URL(`https://www.youtube.com/embed/${this.id}`);
    }
}
exports.YoutubeVideo = YoutubeVideo;
