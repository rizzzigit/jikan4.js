"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaManager = void 0;
const tslib_1 = require("tslib");
const base_1 = require("./base");
const manga_1 = require("../resource/content/manga");
const utils_1 = require("../utils");
const meta_1 = require("../resource/meta");
const Jikan_1 = require("../Jikan");
class MangaManager extends base_1.BaseManager {
    search(searchString, filter, offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('manga', offset, maxCount, Object.assign({ [searchString.length === 1 ? 'length' : 'q']: searchString }, filter && (0, utils_1.translateObject)(filter, (key, value) => {
                switch (key) {
                    case 'score': return [key, `${value}`];
                    case 'minScore': return ['min_score', `${value}`];
                    case 'maxScore': return ['max_score', `${value}`];
                    case 'sfw': return [key, ''];
                    case 'genres': return [key, `${value.map((value) => value instanceof meta_1.MangaGenreMeta ? value.id : value)}`];
                    case 'excludeGenres': return ['genres_exclude', `${value.map((value) => value instanceof meta_1.MangaGenreMeta ? value.id : value)}`];
                    case 'magazines': return [key, `${value.map((value) => value instanceof meta_1.MagazineMeta ? value.id : value)}`];
                    case 'orderBy': return ['order_by', `${value}`];
                    default: return [key, `${value}`];
                }
            })));
            return rawData.map((manga) => new manga_1.Manga(this.client, manga));
        });
    }
    list(offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('manga', offset, maxCount);
            return rawData.map((manga) => new manga_1.Manga(this.client, manga));
        });
    }
    listTop(filter, offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('top/manga', offset, maxCount, Object.assign({}, filter));
            return rawData.map((manga) => new manga_1.Manga(this.client, manga));
        });
    }
    listRecommended(offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('recommendations/manga', offset, maxCount);
            return rawData.map((manga) => new manga_1.Manga(this.client, manga));
        });
    }
    random(sfw) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request('random/manga', { disableCaching: 'true', sfw: sfw ? 'true' : '' });
            return new manga_1.Manga(this.client, rawData);
        });
    }
    get(mangaId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`manga/${mangaId}`);
            return rawData ? new manga_1.Manga(this.client, rawData) : undefined;
        });
    }
    getFull(mangaId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`manga/${mangaId}/full`);
            return rawData ? new manga_1.MangaFull(this.client, rawData) : undefined;
        });
    }
    getCharacters(mangaId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`manga/${mangaId}/characters`);
            return rawData ? rawData.map((characterReference) => manga_1.Manga.parseCharacerReference(this.client, characterReference)) : undefined;
        });
    }
    getNews(mangaId, offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`manga/${mangaId}/news`, offset, maxCount);
            return rawData ? rawData.map((news) => manga_1.Manga.parseNews(news)) : undefined;
        });
    }
    getTopics(mangaId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`manga/${mangaId}/forum`);
            return rawData ? rawData.map((topic) => manga_1.Manga.parseTopic(topic)) : undefined;
        });
    }
    getPictures(mangaId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`manga/${mangaId}/pictures`);
            return rawData ? rawData.map((picture) => Jikan_1.BaseClass.parseImage(picture)) : undefined;
        });
    }
    getStatistics(mangaId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`manga/${mangaId}/statistics`);
            return rawData ? manga_1.Manga.parseStatistics(rawData) : undefined;
        });
    }
    getMoreInfo(mangaId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`manga/${mangaId}/moreinfo`);
            return rawData ? rawData.moreinfo || null : undefined;
        });
    }
    getUserUpdates(mangaId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`manga/${mangaId}/userupdates`);
            return rawData ? rawData.map((userUpdate) => manga_1.Manga.parseUserUpdate(userUpdate)) : undefined;
        });
    }
    getReviews(mangaId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`manga/${mangaId}/reviews`);
            return rawData ? rawData.map((review) => manga_1.Manga.parseReview(review)) : undefined;
        });
    }
    getRelations(mangaId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`manga/${mangaId}/relations`);
            return rawData ? rawData.map((relation) => manga_1.Manga.parseRelationGroup(this.client, manga_1.Manga.parseRelationType(relation.relation), relation)) : undefined;
        });
    }
    getExternal(mangaId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`manga/${mangaId}/external`);
            return rawData ? rawData.map((external) => manga_1.Manga.parseExternal(external)) : undefined;
        });
    }
}
exports.MangaManager = MangaManager;
