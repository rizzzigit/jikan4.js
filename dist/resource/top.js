"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopMangaReview = exports.TopAnimeReview = void 0;
const manga_1 = require("./content/manga");
const anime_1 = require("./content/anime");
const meta_1 = require("./meta");
class TopAnimeReview extends anime_1.AnimeReview {
    constructor(client, data) {
        super(client, data);
        this.anime = new meta_1.AnimeMeta(this.client, data.entry);
    }
}
exports.TopAnimeReview = TopAnimeReview;
class TopMangaReview extends manga_1.MangaReview {
    constructor(client, data) {
        super(client, data);
        this.manga = new meta_1.MangaMeta(this.client, data.entry);
    }
}
exports.TopMangaReview = TopMangaReview;
