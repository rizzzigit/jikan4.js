"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaManager = void 0;
const tslib_1 = require("tslib");
const base_1 = require("./base");
const manga_1 = require("../resource/content/manga");
const misc_1 = require("../resource/misc");
const utils_1 = require("../utils");
const meta_1 = require("../resource/meta");
class MangaManager extends base_1.BaseManager {
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    storeCache(data) {
        return super.storeCache(`manga/${data.mal_id}`, data);
    }
    search(searchString, filter, offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource('manga', offset, maxCount, Object.assign({ [searchString.length === 1 ? 'length' : 'q']: searchString }, filter && (0, utils_1.translateObject)(filter, (key, value) => {
                switch (key) {
                    case 'score': return [key, `${value}`];
                    case 'minScore': return ['min_score', `${value}`];
                    case 'maxScore': return ['max_score', `${value}`];
                    case 'sfw': return [key, ''];
                    case 'genres': return [key, `${value.map((value) => value instanceof meta_1.MangaGenreMeta ? value.ID : value)}`];
                    case 'excludeGenres': return ['genres_exclude', `${value.map((value) => value instanceof meta_1.MangaGenreMeta ? value.ID : value)}`];
                    case 'magazines': return ['magazine', `${value.map((value) => value instanceof meta_1.MagazineMeta ? value.ID : value)}`];
                    case 'orderBy': return ['order_by', `${value}`];
                    default: return [key, `${value}`];
                }
            })));
            return rawData.map((data) => this.storeCache(data)).map((manga) => new manga_1.Manga(this.client, manga));
        });
    }
    list(offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource('manga', offset, maxCount);
            return rawData.map((data) => this.storeCache(data)).map((manga) => new manga_1.Manga(this.client, manga));
        });
    }
    listTop(offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource('top/manga', offset, maxCount);
            return rawData.map((data) => this.storeCache(data)).map((manga) => new manga_1.Manga(this.client, manga));
        });
    }
    listRecommended(offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource('recommendations/manga', offset, maxCount);
            return rawData.map((data) => this.storeCache(data)).map((manga) => new manga_1.Manga(this.client, manga));
        });
    }
    random() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource('random/manga', { disableCaching: 'true' });
            return new manga_1.Manga(this.client, rawData);
        });
    }
    get(mangaID) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`manga/${mangaID}`);
            return rawData ? new manga_1.Manga(this.client, rawData) : undefined;
        });
    }
    getCharacters(mangaID) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`manga/${mangaID}/characters`);
            return rawData ? rawData.map((characterReference) => new manga_1.MangaCharacterReference(this.client, mangaID, characterReference)) : undefined;
        });
    }
    getNews(mangaID, offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource(`manga/${mangaID}/news`, offset, maxCount);
            return rawData ? rawData.map((news) => new manga_1.MangaNews(this.client, mangaID, news)) : undefined;
        });
    }
    getTopics(mangaID) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`manga/${mangaID}/forum`);
            return rawData ? rawData.map((topic) => new manga_1.MangaTopic(this.client, mangaID, topic)) : undefined;
        });
    }
    getPictures(mangaID) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`manga/${mangaID}/pictures`);
            return rawData ? rawData.map((picture) => new misc_1.Image(this.client, picture)) : undefined;
        });
    }
    getStatistics(mangaID) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`manga/${mangaID}/statistics`);
            return rawData ? new manga_1.MangaStatistics(this.client, mangaID, rawData) : undefined;
        });
    }
    getMoreInfo(mangaID) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`manga/${mangaID}/moreinfo`);
            return rawData ? rawData.moreinfo || null : undefined;
        });
    }
    getUserUpdates(mangaID) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`manga/${mangaID}/userupdates`);
            return rawData ? rawData.map((userUpdate) => new manga_1.MangaUserUpdate(this.client, mangaID, userUpdate)) : undefined;
        });
    }
    getReviews(mangaID) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`manga/${mangaID}/reviews`);
            return rawData ? rawData.map((review) => new manga_1.MangaReview(this.client, mangaID, review)) : undefined;
        });
    }
    getRelations(mangaID) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource(`manga/${mangaID}/relations`);
            return rawData ? rawData.map((relation) => new manga_1.MangaRelationGroup(this.client, mangaID, manga_1.MangaRelationGroup.parseRelation(relation.relation), relation)) : undefined;
        });
    }
}
exports.MangaManager = MangaManager;
