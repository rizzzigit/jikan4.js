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
exports.AnimeManager = void 0;
const base_1 = require("../manager/base");
const base_2 = require("../resource/content/base");
const anime_1 = require("../resource/content/anime");
const misc_1 = require("../resource/misc");
const utils_1 = require("../utils");
const meta_1 = require("../resource/meta");
class AnimeManager extends base_1.BaseManager {
    search(searchString, filter, offset, maxCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('anime', offset, maxCount, Object.assign({ [searchString.length === 1 ? 'letter' : 'q']: searchString }, filter && (0, utils_1.translateObject)(filter, (key, value) => {
                switch (key) {
                    case 'score': return [key, `${value}`];
                    case 'minScore': return ['min_score', `${value}`];
                    case 'maxScore': return ['max_score', `${value}`];
                    case 'sfw': return [key, ''];
                    case 'genres': return [key, `${value.map((value) => value instanceof meta_1.AnimeGenreMeta ? value.id : value)}`];
                    case 'excludeGenres': return ['genres_exclude', `${value.map((value) => value instanceof meta_1.AnimeGenreMeta ? value.id : value)}`];
                    case 'producers': return [key, `${value.map((value) => value instanceof meta_1.ProducerMeta ? value.id : value)}`];
                    case 'orderBy': return ['order_by', `${value}`];
                    default: return [key, `${value}`];
                }
            })));
            return rawData.map((anime) => anime).map((anime) => new anime_1.Anime(this.client, anime));
        });
    }
    list(offset, maxCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('anime', offset, maxCount);
            return rawData.map((anime) => new anime_1.Anime(this.client, anime));
        });
    }
    listTop(filter, offset, maxCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('top/anime', offset, maxCount, Object.assign({}, filter));
            return rawData.map((anime) => new anime_1.Anime(this.client, anime));
        });
    }
    listRecommended(offset, maxCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('recommendations/anime', offset, maxCount);
            return rawData.map((anime) => new anime_1.Anime(this.client, anime));
        });
    }
    listScheduled(offset, maxCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('schedules', offset, maxCount);
            return rawData.map((anime) => new anime_1.Anime(this.client, anime));
        });
    }
    random(sfw) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request('random/anime', { disableCaching: 'true', sfw: sfw ? 'true' : '' });
            return new anime_1.Anime(this.client, rawData);
        });
    }
    get(animeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}`);
            return rawData ? new anime_1.Anime(this.client, rawData) : undefined;
        });
    }
    getFull(animeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/full`);
            return rawData ? new anime_1.AnimeFull(this.client, rawData) : undefined;
        });
    }
    getCharacters(animeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/characters`);
            return rawData ? rawData.map((characterReference) => new anime_1.AnimeCharacterReference(this.client, characterReference)) : undefined;
        });
    }
    getStaff(animeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/staff`);
            return rawData ? rawData.map((staffReference) => new anime_1.AnimeStaffReference(this.client, staffReference)) : undefined;
        });
    }
    getEpisodes(animeId, offset, maxCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`anime/${animeId}/episodes`, offset, maxCount);
            return rawData ? rawData.map((partialEpisode) => new anime_1.AnimePartialEpisode(this.client, animeId, partialEpisode)) : undefined;
        });
    }
    getEpisode(animeId, episodeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/episodes/${episodeId}`);
            return rawData ? new anime_1.AnimeEpisode(this.client, animeId, rawData) : undefined;
        });
    }
    getNews(animeId, offset, maxCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`anime/${animeId}/news`, offset, maxCount);
            return rawData ? rawData.map((news) => new base_2.ContentNews(this.client, news)) : undefined;
        });
    }
    getTopics(animeId_1) {
        return __awaiter(this, arguments, void 0, function* (animeId, topic = 'all') {
            const rawData = yield this.request(`anime/${animeId}/forum`, { topic });
            return rawData ? rawData.map((topic) => new anime_1.AnimeTopic(this.client, topic)) : undefined;
        });
    }
    getVideos(animeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/videos`);
            return rawData ? new anime_1.AnimeVideo(this.client, rawData) : undefined;
        });
    }
    getVideosEpisodes(animeId, offset, maxCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`anime/${animeId}/videos/episodes`, offset, maxCount);
            return rawData ? rawData.map((episode) => new anime_1.AnimeEpisodeVideo(this.client, episode)) : undefined;
        });
    }
    getPictures(animeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/pictures`);
            return rawData ? rawData.map((picture) => new misc_1.ImageFormatCollection(this.client, picture)) : undefined;
        });
    }
    getStatistics(animeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/statistics`);
            return rawData ? new anime_1.AnimeStatistics(this.client, rawData) : undefined;
        });
    }
    getMoreInfo(animeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/moreinfo`);
            return rawData ? rawData.moreinfo || null : undefined;
        });
    }
    getRecommendations(animeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/recommendations`);
            return rawData ? rawData.map((recommendation) => new anime_1.AnimeRecommendation(this.client, recommendation)) : undefined;
        });
    }
    getUserUpdates(animeId, offset, maxCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`anime/${animeId}/userupdates`, offset, maxCount);
            return rawData ? rawData.map((userUpdate) => new anime_1.AnimeUserUpdate(this.client, userUpdate)) : undefined;
        });
    }
    getReviews(animeId, offset, maxCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`anime/${animeId}/reviews`, offset, maxCount);
            return rawData ? rawData.map((review) => new anime_1.AnimeReview(this.client, review)) : undefined;
        });
    }
    getRelations(animeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/relations`);
            return rawData ? rawData.map((relation) => new anime_1.AnimeRelationGroup(this.client, anime_1.AnimeRelationGroup.parseRelation(relation.relation), relation)) : undefined;
        });
    }
    getThemes(animeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request(`anime/${animeId}/themes`);
        });
    }
    getExternal(animeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/external`);
            return rawData ? rawData.map((external) => new base_2.ContentExternal(this.client, external)) : undefined;
        });
    }
    getStreamingLinks(animeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request(`anime/${animeId}/streaming`);
        });
    }
}
exports.AnimeManager = AnimeManager;
