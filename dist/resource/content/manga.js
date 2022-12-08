"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaFull = exports.Manga = void 0;
const base_1 = require("./base");
const meta_1 = require("../meta");
const genre_1 = require("../../manager/genre");
class Manga extends base_1.Content {
    /** @hidden */
    static parsePublishStatus(input) {
        switch (input === null || input === void 0 ? void 0 : input.toLowerCase().trim()) {
            case 'finished': return 'Finished';
            case 'publishing': return 'Publishing';
            case 'on hiatus': return 'OnHiatus';
            case 'discontinued': return 'Discontinued';
            case 'not yet published': return 'NotYetPublished';
            default: return 'Unknown';
        }
    }
    /** @hidden */
    static parsePublishInfo(data) {
        return {
            status: this.parsePublishStatus(data.status),
            publishing: !!data.publishing,
            publishedFrom: Manga.parseDate(data.published.from, true),
            publishedTo: Manga.parseDate(data.published.to, true)
        };
    }
    /** @hidden */
    static parseType(input) {
        switch (input === null || input === void 0 ? void 0 : input.toLowerCase().trim()) {
            case 'manga': return 'Manga';
            case 'novel': return 'Novel';
            case 'light novel': return 'LightNovel';
            case 'one-shot': return 'OneShot';
            case 'doujinshi':
            case 'doujin': return 'Doujinshi';
            case 'manhua': return 'Manhua';
            case 'manhwa': return 'Manhwa';
            case 'oel': return 'OEL';
            default: return 'Unknown';
        }
    }
    /** @hidden */
    static parseStatistics(data) {
        return Object.assign(Object.assign({}, super.parseStatistics(data)), { reading: data.reading, planToRead: data.plan_to_read });
    }
    /** @hidden */
    static parseUserUpdate(data) {
        return Object.assign(Object.assign({}, super.parseUserUpdate(data)), { volumesRead: data.volumes_read, volumesTotal: data.volumes_total, chaptersRead: data.chapters_read, chaptersTotal: data.chapters_total });
    }
    /** @hidden */
    static parseReview(data) {
        return Object.assign(Object.assign({}, super.parseReview(data)), { chaptersRead: data.chapters_read, reactions: this.parseReactions(data.reactions) });
    }
    /** @hidden */
    static parseTopReview(client, data) {
        return Object.assign(Object.assign({}, this.parseReview(data)), { manga: new meta_1.MangaMeta(client, data.entry) });
    }
    /** @hidden */
    static parseRelationGroup(client, relation, data) {
        var _a;
        const a = super.parseRelationGroup(client, relation, data);
        return Object.assign(Object.assign({}, a), { items: ((_a = data.entry) === null || _a === void 0 ? void 0 : _a.map((item) => new (a.relation === 'Adaptation' ? meta_1.AnimeMeta : meta_1.MangaMeta)(client, item))) || [] });
    }
    /** @hidden */
    static parseCharacerReference(client, data) {
        return {
            character: new meta_1.CharacterMeta(client, data.character),
            role: data.role
        };
    }
    /** @hidden */
    static parseTopic(data) {
        return {
            id: data.mal_id,
            url: this.parseURL(data.url, false),
            title: data.title,
            date: this.parseDate(data.date),
            authorUsername: data.author_username,
            authorURL: data.author_url,
            comments: data.comments
        };
    }
    /** @hidden */
    static parseRecommendation(client, data) {
        return {
            entry: new meta_1.MangaMeta(client, data.entry),
            URL: this.parseURL(data.url),
            votes: data.votes
        };
    }
    get isExplicit() {
        return !!(this.genres.find((genre) => !!genre_1.mangaExplicitGenres.find((genreEntry) => genreEntry[0] === genre.id)));
    }
    getCharacters() {
        return this.client.manga.getCharacters(this.id);
    }
    getNews(offset, maxCount) {
        return this.client.manga.getNews(this.id, offset, maxCount);
    }
    getTopics() {
        return this.client.manga.getTopics(this.id);
    }
    getPictures() {
        return this.client.manga.getPictures(this.id);
    }
    getStatistics() {
        return this.client.manga.getStatistics(this.id);
    }
    getMoreInfo() {
        return this.client.manga.getMoreInfo(this.id);
    }
    getUserUpdates() {
        return this.client.manga.getUserUpdates(this.id);
    }
    getReviews() {
        return this.client.manga.getReviews(this.id);
    }
    getRelations() {
        return this.client.manga.getRelations(this.id);
    }
    getExternal() {
        return this.client.manga.getExternal(this.id);
    }
    getFull() {
        return this.client.manga.getFull(this.id);
    }
    constructor(client, data) {
        var _a, _b, _c, _d, _e, _f;
        super(client, data);
        this.type = Manga.parseType(data.type);
        this.chapters = data.chapters;
        this.volumes = data.volumes;
        this.publishInfo = Manga.parsePublishInfo(data);
        this.authors = ((_a = data.authors) === null || _a === void 0 ? void 0 : _a.map((author) => new meta_1.PersonMeta(this.client, author))) || [];
        this.serializations = ((_b = data.serializations) === null || _b === void 0 ? void 0 : _b.map((serialization) => new meta_1.MagazineMeta(this.client, serialization))) || [];
        this.genres = ((_c = data.genres) === null || _c === void 0 ? void 0 : _c.map((genre) => new meta_1.MangaGenreMeta(this.client, genre, 'Genre'))) || [];
        this.explicitGenres = ((_d = data.explicit_genres) === null || _d === void 0 ? void 0 : _d.map((genre) => new meta_1.MangaGenreMeta(this.client, genre, 'Explicit'))) || [];
        this.demographics = ((_e = data.demographics) === null || _e === void 0 ? void 0 : _e.map((genre) => new meta_1.MangaGenreMeta(this.client, genre, 'Demographic'))) || [];
        this.themes = ((_f = data.themes) === null || _f === void 0 ? void 0 : _f.map((genre) => new meta_1.MangaGenreMeta(this.client, genre, 'Theme'))) || [];
    }
}
exports.Manga = Manga;
class MangaFull extends Manga {
    constructor(client, data) {
        var _a, _b;
        super(client, data);
        this.relations = ((_a = data.relations) === null || _a === void 0 ? void 0 : _a.map((relation) => Manga.parseRelationGroup(client, Manga.parseRelationType(relation.relation), relation))) || [];
        this.external = ((_b = data.external) === null || _b === void 0 ? void 0 : _b.map((external) => Manga.parseExternal(external))) || [];
    }
}
exports.MangaFull = MangaFull;
