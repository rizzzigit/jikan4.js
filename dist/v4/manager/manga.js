"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaManager = void 0;
const base_1 = require("./base");
const base_2 = require("../resource/content/base");
const manga_1 = require("../resource/content/manga");
const misc_1 = require("../resource/misc");
const utils_1 = require("../utils");
const meta_1 = require("../resource/meta");
class MangaManager extends base_1.BaseManager {
    search(searchString, filter, offset, maxCount) {
        return __awaiter(this, void 0, void 0, function* () {
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
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('manga', offset, maxCount);
            return rawData.map((manga) => new manga_1.Manga(this.client, manga));
        });
    }
    listTop(filter, offset, maxCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('top/manga', offset, maxCount, Object.assign({}, filter));
            return rawData.map((manga) => new manga_1.Manga(this.client, manga));
        });
    }
    listRecommended(offset, maxCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('recommendations/manga', offset, maxCount);
            return rawData.map((manga) => new manga_1.Manga(this.client, manga));
        });
    }
    random(sfw) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request('random/manga', { disableCaching: 'true', sfw: sfw ? 'true' : '' });
            return new manga_1.Manga(this.client, rawData);
        });
    }
    get(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`manga/${mangaId}`);
            return rawData ? new manga_1.Manga(this.client, rawData) : undefined;
        });
    }
    getFull(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`manga/${mangaId}/full`);
            return rawData ? new manga_1.MangaFull(this.client, rawData) : undefined;
        });
    }
    getCharacters(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`manga/${mangaId}/characters`);
            return rawData ? rawData.map((characterReference) => new manga_1.MangaCharacterReference(this.client, characterReference)) : undefined;
        });
    }
    getNews(mangaId, offset, maxCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`manga/${mangaId}/news`, offset, maxCount);
            return rawData ? rawData.map((news) => new base_2.ContentNews(this.client, news)) : undefined;
        });
    }
    getTopics(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`manga/${mangaId}/forum`);
            return rawData ? rawData.map((topic) => new manga_1.MangaTopic(this.client, topic)) : undefined;
        });
    }
    getPictures(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`manga/${mangaId}/pictures`);
            return rawData ? rawData.map((picture) => new misc_1.ImageFormatCollection(this.client, picture)) : undefined;
        });
    }
    getStatistics(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`manga/${mangaId}/statistics`);
            return rawData ? new manga_1.MangaStatistics(this.client, rawData) : undefined;
        });
    }
    getMoreInfo(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`manga/${mangaId}/moreinfo`);
            return rawData ? rawData.moreinfo || null : undefined;
        });
    }
    getUserUpdates(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`manga/${mangaId}/userupdates`);
            return rawData ? rawData.map((userUpdate) => new manga_1.MangaUserUpdate(this.client, userUpdate)) : undefined;
        });
    }
    getReviews(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`manga/${mangaId}/reviews`);
            return rawData ? rawData.map((review) => new manga_1.MangaReview(this.client, review)) : undefined;
        });
    }
    getRelations(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`manga/${mangaId}/relations`);
            return rawData ? rawData.map((relation) => new manga_1.MangaRelationGroup(this.client, manga_1.MangaRelationGroup.parseRelation(relation.relation), relation)) : undefined;
        });
    }
    getExternal(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`manga/${mangaId}/external`);
            return rawData ? rawData.map((external) => new base_2.ContentExternal(this.client, external)) : undefined;
        });
    }
}
exports.MangaManager = MangaManager;
