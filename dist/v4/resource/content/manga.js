"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaFull = exports.MangaRelationGroup = exports.MangaReview = exports.MangaUserUpdate = exports.MangaRecommendation = exports.MangaStatistics = exports.MangaTopic = exports.MangaCharacterReference = exports.Manga = exports.MangaPublishInformation = void 0;
const base_1 = require("../base");
const base_2 = require("./base");
const meta_1 = require("../meta");
const genre_1 = require("../../manager/genre");
class MangaPublishInformation extends base_1.BaseClass {
    /** @hidden */
    static parseMangaPublishStatus(input) {
        switch (input === null || input === void 0 ? void 0 : input.toLowerCase().trim()) {
            case 'finished': return 'Finished';
            case 'publishing': return 'Publishing';
            case 'on hiatus': return 'On Hiatus';
            case 'discontinued': return 'Discontinued';
            case 'not yet published': return 'Not Yet Published';
            default: return 'Unknown';
        }
    }
    constructor(client, data) {
        super(client);
        this.status = MangaPublishInformation.parseMangaPublishStatus(data.status);
        this.publishing = !!data.publishing;
        this.publishedFrom = MangaPublishInformation.parseDate(data.published.from, true);
        this.publishedTo = MangaPublishInformation.parseDate(data.published.to, true);
    }
}
exports.MangaPublishInformation = MangaPublishInformation;
class Manga extends base_2.Content {
    /** @hidden */
    static parseType(input) {
        switch (input === null || input === void 0 ? void 0 : input.toLowerCase().trim()) {
            case 'manga': return 'Manga';
            case 'novel': return 'Novel';
            case 'light novel': return 'Light Novel';
            case 'one-shot': return 'One Shot';
            case 'doujinshi':
            case 'doujin': return 'Doujinshi';
            case 'manhua': return 'Manhua';
            case 'manhwa': return 'Manhwa';
            case 'oel': return 'OEL';
            default: return 'Unknown';
        }
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
    getRecommendations() {
        return this.client.manga.getRecommendations(this.id);
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
        this.publishInfo = new MangaPublishInformation(client, data);
        this.authors = ((_a = data.authors) === null || _a === void 0 ? void 0 : _a.map((author) => new meta_1.PersonMeta(this.client, author))) || [];
        this.serializations = ((_b = data.serializations) === null || _b === void 0 ? void 0 : _b.map((serialization) => new meta_1.MagazineMeta(this.client, serialization))) || [];
        this.genres = ((_c = data.genres) === null || _c === void 0 ? void 0 : _c.map((genre) => new meta_1.MangaGenreMeta(this.client, genre, 'Genre'))) || [];
        this.explicitGenres = ((_d = data.explicit_genres) === null || _d === void 0 ? void 0 : _d.map((genre) => new meta_1.MangaGenreMeta(this.client, genre, 'Explicit'))) || [];
        this.demographics = ((_e = data.demographics) === null || _e === void 0 ? void 0 : _e.map((genre) => new meta_1.MangaGenreMeta(this.client, genre, 'Demographic'))) || [];
        this.themes = ((_f = data.themes) === null || _f === void 0 ? void 0 : _f.map((genre) => new meta_1.MangaGenreMeta(this.client, genre, 'Theme'))) || [];
    }
}
exports.Manga = Manga;
class MangaCharacterReference extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.character = new meta_1.CharacterMeta(client, data.character);
        this.role = data.role;
    }
}
exports.MangaCharacterReference = MangaCharacterReference;
class MangaTopic extends base_1.BaseResource {
    constructor(client, data) {
        super(client, data);
        this.title = data.title;
        this.date = MangaTopic.parseDate(data.date);
        this.authorUsername = data.author_username;
        this.authorURL = MangaTopic.parseURL(data.author_url);
        this.comments = data.comments;
    }
}
exports.MangaTopic = MangaTopic;
class MangaStatistics extends base_2.ContentStatistics {
    constructor(client, data) {
        super(client, data);
        this.reading = data.reading;
        this.planToRead = data.plan_to_read;
    }
}
exports.MangaStatistics = MangaStatistics;
class MangaRecommendation extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.entry = new meta_1.MangaMeta(client, data.entry);
        this.URL = MangaRecommendation.parseURL(data.url);
        this.votes = data.votes;
    }
}
exports.MangaRecommendation = MangaRecommendation;
class MangaUserUpdate extends base_2.ContentUserUpdate {
    constructor(client, data) {
        super(client, data);
        this.volumesRead = data.volumes_read;
        this.volumesTotal = data.volumes_total;
        this.chaptersRead = data.chapters_read;
        this.chaptersTotal = data.chapters_total;
    }
}
exports.MangaUserUpdate = MangaUserUpdate;
class MangaReview extends base_2.ContentReview {
    constructor(client, data) {
        super(client, data);
        this.chaptersRead = data.chapters_read || 0;
    }
}
exports.MangaReview = MangaReview;
class MangaRelationGroup extends base_2.ContentRelationGroup {
    constructor(client, relation, data) {
        var _a;
        super(client, relation);
        this.items = ((_a = data.entry) === null || _a === void 0 ? void 0 : _a.map((item) => new (this.relation === 'Adaptation' ? meta_1.AnimeMeta : meta_1.MangaMeta)(this.client, item))) || [];
    }
}
exports.MangaRelationGroup = MangaRelationGroup;
class MangaFull extends Manga {
    constructor(client, data) {
        var _a, _b;
        super(client, data);
        this.relations = ((_a = data.relations) === null || _a === void 0 ? void 0 : _a.map((relation) => new MangaRelationGroup(client, MangaRelationGroup.parseRelation(relation.relation), relation))) || [];
        this.external = ((_b = data.external) === null || _b === void 0 ? void 0 : _b.map((external) => new base_2.ContentExternal(client, external))) || [];
    }
}
exports.MangaFull = MangaFull;
