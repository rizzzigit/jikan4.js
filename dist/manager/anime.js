"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimeManager = void 0;
const tslib_1 = require("tslib");
const base_1 = require("../manager/base");
const anime_1 = require("../resource/content/anime");
const utils_1 = require("../utils");
const meta_1 = require("../resource/meta");
const Jikan_1 = require("../Jikan");
class AnimeManager extends base_1.BaseManager {
    search(searchString, filter, offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('anime', offset, maxCount);
            return rawData.map((anime) => new anime_1.Anime(this.client, anime));
        });
    }
    listTop(filter, offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('top/anime', offset, maxCount, Object.assign({}, filter));
            return rawData.map((anime) => new anime_1.Anime(this.client, anime));
        });
    }
    listRecommended(offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('recommendations/anime', offset, maxCount);
            return rawData.map((anime) => new anime_1.Anime(this.client, anime));
        });
    }
    listScheduled(offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('schedules', offset, maxCount);
            return rawData.map((anime) => new anime_1.Anime(this.client, anime));
        });
    }
    random(sfw) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request('random/anime', { disableCaching: 'true', sfw: sfw ? 'true' : '' });
            return new anime_1.Anime(this.client, rawData);
        });
    }
    get(animeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}`);
            return rawData ? new anime_1.Anime(this.client, rawData) : undefined;
        });
    }
    getFull(animeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/full`);
            return rawData ? new anime_1.AnimeFull(this.client, rawData) : undefined;
        });
    }
    getCharacters(animeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/characters`);
            return rawData ? rawData.map((characterReference) => anime_1.Anime.parseCharacterReference(this.client, characterReference)) : undefined;
        });
    }
    getStaff(animeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/staff`);
            return rawData ? rawData.map((staffReference) => anime_1.Anime.parseStaffReference(this.client, staffReference)) : undefined;
        });
    }
    getEpisodes(animeId, offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`anime/${animeId}/episodes`, offset, maxCount);
            return rawData ? rawData.map((partialEpisode) => anime_1.Anime.parsePartialEpisode(Object.assign(partialEpisode, { animeId }))) : undefined;
        });
    }
    getEpisode(animeId, episodeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/episodes/${episodeId}`);
            return rawData ? anime_1.Anime.parseEpisode(Object.assign(rawData, { animeId })) : undefined;
        });
    }
    getNews(animeId, offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`anime/${animeId}/news`, offset, maxCount);
            return rawData ? rawData.map((news) => anime_1.Anime.parseNews(news)) : undefined;
        });
    }
    getTopics(animeId, topic = 'all') {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/forum`, { topic });
            return rawData ? rawData.map((topic) => anime_1.Anime.parseTopc(topic)) : undefined;
        });
    }
    getVideos(animeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/videos`);
            return rawData ? anime_1.Anime.parseVideo(rawData) : undefined;
        });
    }
    getVideosEpisodes(animeId, offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`anime/${animeId}/videos/episodes`, offset, maxCount);
            return rawData ? rawData.map((episode) => anime_1.Anime.parseEpisodeVideo(episode)) : undefined;
        });
    }
    getPictures(animeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/pictures`);
            return rawData ? rawData.map((picture) => Jikan_1.BaseClass.parseImage(picture)) : undefined;
        });
    }
    getStatistics(animeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/statistics`);
            return rawData ? anime_1.Anime.parseStatistics(rawData) : undefined;
        });
    }
    getMoreInfo(animeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/moreinfo`);
            return rawData ? rawData.moreinfo || null : undefined;
        });
    }
    getRecommendations(animeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/recommendations`);
            return rawData ? rawData.map((recommendation) => anime_1.Anime.parseRecommendation(this.client, recommendation)) : undefined;
        });
    }
    getUserUpdates(animeId, offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`anime/${animeId}/userupdates`, offset, maxCount);
            return rawData ? rawData.map((userUpdate) => anime_1.Anime.parseUserUpdate(userUpdate)) : undefined;
        });
    }
    getReviews(animeId, offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`anime/${animeId}/reviews`, offset, maxCount);
            return rawData ? rawData.map((review) => anime_1.Anime.parseReview(review)) : undefined;
        });
    }
    getRelations(animeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/relations`);
            return rawData ? rawData.map((relation) => anime_1.Anime.parseRelationGroup(this.client, anime_1.Anime.parseRelationType(relation.relation), relation)) : undefined;
        });
    }
    getThemes(animeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.request(`anime/${animeId}/themes`);
        });
    }
    getExternal(animeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/external`);
            return rawData ? rawData.map((external) => anime_1.Anime.parseExternal(external)) : undefined;
        });
    }
    getStreamingLinks(animeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.request(`anime/${animeId}/streaming`);
        });
    }
}
exports.AnimeManager = AnimeManager;
