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
    storeCache(body) {
        return super.storeCache({ path: `manga/${body.mal_id}` }, body);
    }
    search(searchString, filter, offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('manga', offset, maxCount, Object.assign({ disableCaching: 'true', [searchString.length === 1 ? 'length' : 'q']: searchString }, filter && (0, utils_1.translateObject)(filter, (key, value) => {
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
            return rawData.map((manga) => new manga_1.Manga(this.client, this.storeCache(manga)));
        });
    }
    list(offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('manga', offset, maxCount);
            return rawData.map((manga) => new manga_1.Manga(this.client, this.storeCache(manga)));
        });
    }
    listTop(filter, offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('top/manga', offset, maxCount, Object.assign({}, filter));
            return rawData.map((manga) => new manga_1.Manga(this.client, this.storeCache(manga)));
        });
    }
    listRecommended(offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('recommendations/manga', offset, maxCount);
            return rawData.map((manga) => new manga_1.Manga(this.client, this.storeCache(manga)));
        });
    }
    random() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request('random/manga', { disableCaching: 'true' });
            return new manga_1.Manga(this.client, rawData);
        });
    }
    get(mangaId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`manga/${mangaId}`);
            return rawData ? new manga_1.Manga(this.client, rawData) : undefined;
        });
    }
    getCharacters(mangaId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`manga/${mangaId}/characters`);
            return rawData ? rawData.map((characterReference) => new manga_1.MangaCharacterReference(this.client, mangaId, characterReference)) : undefined;
        });
    }
    getNews(mangaId, offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`manga/${mangaId}/news`, offset, maxCount);
            return rawData ? rawData.map((news) => new manga_1.MangaNews(this.client, mangaId, news)) : undefined;
        });
    }
    getTopics(mangaId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`manga/${mangaId}/forum`);
            return rawData ? rawData.map((topic) => new manga_1.MangaTopic(this.client, mangaId, topic)) : undefined;
        });
    }
    getPictures(mangaId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`manga/${mangaId}/pictures`);
            return rawData ? rawData.map((picture) => new misc_1.Image(this.client, picture)) : undefined;
        });
    }
    getStatistics(mangaId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`manga/${mangaId}/statistics`);
            return rawData ? new manga_1.MangaStatistics(this.client, mangaId, rawData) : undefined;
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
            return rawData ? rawData.map((userUpdate) => new manga_1.MangaUserUpdate(this.client, mangaId, userUpdate)) : undefined;
        });
    }
    getReviews(mangaId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`manga/${mangaId}/reviews`);
            return rawData ? rawData.map((review) => new manga_1.MangaReview(this.client, mangaId, review)) : undefined;
        });
    }
    getRelations(mangaId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`manga/${mangaId}/relations`);
            return rawData ? rawData.map((relation) => new manga_1.MangaRelationGroup(this.client, mangaId, manga_1.MangaRelationGroup.parseRelation(relation.relation), relation)) : undefined;
        });
    }
}
exports.MangaManager = MangaManager;
