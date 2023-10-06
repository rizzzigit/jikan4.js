"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewManga = exports.ReviewAnime = void 0;
const anime_1 = require("./content/anime");
const manga_1 = require("./content/manga");
const meta_1 = require("./meta");
class ReviewAnime extends anime_1.AnimeReview {
    constructor(client, data) {
        super(client, data);
        this.entry = new meta_1.AnimeMeta(client, data.entry);
    }
}
exports.ReviewAnime = ReviewAnime;
class ReviewManga extends manga_1.MangaReview {
    constructor(client, data) {
        super(client, data);
        this.entry = new meta_1.MangaMeta(client, data.entry);
    }
}
exports.ReviewManga = ReviewManga;
