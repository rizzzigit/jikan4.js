"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopMangaReview = void 0;
const meta_1 = require("./meta");
class TopMangaReview extends manga_1.MangaReview {
    constructor(client, data) {
        super(client, data);
        this.manga = new meta_1.MangaMeta(this.client, data.entry);
    }
}
exports.TopMangaReview = TopMangaReview;
