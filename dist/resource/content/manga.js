"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaRelationGroup = exports.MangaReview = exports.MangaReviewScores = exports.MangaUserUpdate = exports.MangaRecommendation = exports.MangaStatistics = exports.MangaTopic = exports.MangaNews = exports.MangaCharacterReference = exports.Manga = exports.MangaPublishInformation = void 0;
const base_1 = require("../base");
const base_2 = require("./base");
const meta_1 = require("../meta");
const genre_1 = require("../../manager/genre");
class MangaPublishInformation extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.status = MangaPublishInformation.parseStatus(data.status);
        this.publishing = !!data.publishing;
        this.publishedFrom = MangaPublishInformation.parseDate(data.published.from, true);
        this.publishedTo = MangaPublishInformation.parseDate(data.published.to, true);
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    static parseStatus(input) {
        switch (input === null || input === void 0 ? void 0 : input.toLowerCase().trim()) {
            case 'finished': return 'Finished';
            case 'publishing': return 'Publishing';
            case 'on hiatus': return 'OnHiatus';
            case 'discontinued': return 'Discontinued';
            case 'not yet published': return 'NotYetPublished';
            default: return 'Unknown';
        }
    }
}
exports.MangaPublishInformation = MangaPublishInformation;
class Manga extends base_2.Content {
    constructor(client, data) {
        super(client, data);
        this.type = Manga.parseType(data.type);
        this.chapters = Manga.parseNumber(data.chapters);
        this.volumes = Manga.parseNumber(data.volumes);
        this.publishInfo = new MangaPublishInformation(client, data);
        this.authors = data.authors.map((author) => new meta_1.PersonMeta(this.client, author));
        this.serializations = data.serializations.map((serialization) => new meta_1.MagazineMeta(this.client, serialization));
        this.genres = data.genres.map((genre) => new meta_1.MangaGenreMeta(this.client, genre));
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    static parseType(input) {
        switch (input === null || input === void 0 ? void 0 : input.toLowerCase().trim()) {
            case 'manga': return 'Manga';
            case 'novel': return 'Novel';
            case 'light novel': return 'LightNovel';
            case 'one-shot': return 'OneShot';
            case 'doujinshi': return 'Doujinshi';
            case 'manhua': return 'Manhua';
            case 'manhwa': return 'Manhwa';
            case 'oel': return 'OEL';
            default: return 'Unknown';
        }
    }
    get isExplicit() {
        return !!(this.genres.find((genre) => !!genre_1.mangaExplicitGenres.find((genreEntry) => genreEntry[0] === genre.ID)));
    }
    getCharacters() {
        return this.client.manga.getCharacters(this.ID);
    }
    getNews(offset, maxCount) {
        return this.client.manga.getNews(this.ID, offset, maxCount);
    }
    getTopics() {
        return this.client.manga.getTopics(this.ID);
    }
    getPictures() {
        return this.client.manga.getPictures(this.ID);
    }
    getStatistics() {
        return this.client.manga.getStatistics(this.ID);
    }
    getMoreInfo() {
        return this.client.manga.getMoreInfo(this.ID);
    }
    getUserUpdates() {
        return this.client.manga.getUserUpdates(this.ID);
    }
    getReviews() {
        return this.client.manga.getReviews(this.ID);
    }
    getRelations() {
        return this.client.manga.getRelations(this.ID);
    }
}
exports.Manga = Manga;
class MangaCharacterReference extends base_1.BaseClass {
    constructor(client, mangaID, data) {
        super(client);
        this.mangaID = mangaID;
        this.character = new meta_1.CharacterMeta(client, data.character);
        this.role = MangaCharacterReference.parseString(data.role);
    }
    getManga() {
        return this.client.manga.get(this.mangaID);
    }
}
exports.MangaCharacterReference = MangaCharacterReference;
class MangaNews extends base_2.ContentNews {
    constructor(client, mangaID, data) {
        super(client, data);
        this.mangaID = mangaID;
    }
    getManga() {
        return this.client.manga.get(this.mangaID);
    }
}
exports.MangaNews = MangaNews;
class MangaTopic extends base_1.BaseResource {
    constructor(client, mangaID, data) {
        super(client, data);
        this.mangaID = mangaID;
        this.title = MangaTopic.parseString(data.title);
        this.date = MangaTopic.parseDate(data.date);
        this.authorUsername = MangaTopic.parseString(data.author_username);
        this.authorURL = MangaTopic.parseURL(data.author_url);
        this.comments = MangaTopic.parseNumber(data.comments);
    }
}
exports.MangaTopic = MangaTopic;
class MangaStatistics extends base_2.ContentStatistics {
    constructor(client, mangaID, data) {
        super(client, data);
        this.mangaID = mangaID;
        this.reading = MangaStatistics.parseNumber(data.reading);
        this.planToRead = MangaStatistics.parseNumber(data.plan_to_read);
    }
}
exports.MangaStatistics = MangaStatistics;
class MangaRecommendation extends base_1.BaseClass {
    constructor(client, mangaID, data) {
        super(client);
        this.mangaID = mangaID;
        this.entry = new meta_1.MangaMeta(client, data.entry);
        this.URL = MangaRecommendation.parseURL(data.url);
        this.votes = MangaRecommendation.parseNumber(data.votes);
    }
    getManga() {
        return this.client.manga.get(this.mangaID);
    }
}
exports.MangaRecommendation = MangaRecommendation;
class MangaUserUpdate extends base_2.ContentUserUpdate {
    constructor(client, mangaID, data) {
        super(client, data);
        this.mangaID = mangaID;
        this.volumesRead = MangaUserUpdate.parseNumber(data.volumes_read);
        this.volumesTotal = MangaUserUpdate.parseNumber(data.volumes_total);
        this.chaptersRead = MangaUserUpdate.parseNumber(data.chapters_read);
        this.chaptersTotal = MangaUserUpdate.parseNumber(data.chapters_total);
    }
    getManga() {
        return this.client.manga.get(this.mangaID);
    }
}
exports.MangaUserUpdate = MangaUserUpdate;
class MangaReviewScores extends base_2.ContentReviewScores {
    constructor(client, data) {
        super(client, data);
        this.art = data.art;
    }
}
exports.MangaReviewScores = MangaReviewScores;
class MangaReview extends base_2.ContentReview {
    constructor(client, mangaID, data) {
        super(client, data);
        this.mangaID = mangaID;
        this.chaptersRead = MangaReview.parseNumber(data.chapters_read);
        this.scores = new MangaReviewScores(client, data.scores);
    }
    getManga() {
        return this.client.manga.get(this.mangaID);
    }
}
exports.MangaReview = MangaReview;
class MangaRelationGroup extends base_2.ContentRelationGroup {
    constructor(client, mangaID, relation, data) {
        super(client, relation, data);
        this.mangaID = mangaID;
        this.items = data.map((item) => new (this.relation === 'Adaptation' ? meta_1.AnimeMeta : meta_1.MangaMeta)(this.client, item));
    }
    getManga() {
        return this.client.manga.get(this.mangaID);
    }
}
exports.MangaRelationGroup = MangaRelationGroup;
