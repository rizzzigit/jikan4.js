"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimeManager = void 0;
const tslib_1 = require("tslib");
const base_1 = require("../manager/base");
const base_2 = require("../resource/content/base");
const anime_1 = require("../resource/content/anime");
const misc_1 = require("../resource/misc");
const utils_1 = require("../utils");
const meta_1 = require("../resource/meta");
class AnimeManager extends base_1.BaseManager {
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    storeCache(body) {
        return super.storeCache({ path: `anime/${body.mal_id}` }, body);
    }
    search(searchString, filter, offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('anime', offset, maxCount, Object.assign({ disableCaching: 'true', [searchString.length === 1 ? 'letter' : 'q']: searchString }, filter && (0, utils_1.translateObject)(filter, (key, value) => {
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
            return rawData.map((anime) => this.storeCache(anime)).map((anime) => new anime_1.Anime(this.client, anime));
        });
    }
    list(offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('anime', offset, maxCount);
            return rawData.map((anime) => new anime_1.Anime(this.client, this.storeCache(anime)));
        });
    }
    listTop(filter, offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('top/anime', offset, maxCount, Object.assign({}, filter));
            return rawData.map((anime) => new anime_1.Anime(this.client, this.storeCache(anime)));
        });
    }
    listRecommended(offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('recommendations/anime', offset, maxCount);
            return rawData.map((anime) => new anime_1.Anime(this.client, this.storeCache(anime)));
        });
    }
    listScheduled(offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('schedules', offset, maxCount);
            return rawData.map((anime) => new anime_1.Anime(this.client, this.storeCache(anime)));
        });
    }
    random(sfw) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request('random/anime', { disableCaching: 'true', sfw: sfw ? 'true' : '' });
            return new anime_1.Anime(this.client, this.storeCache(rawData));
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
            return rawData ? rawData.map((characterReference) => new anime_1.AnimeCharacterReference(this.client, characterReference)) : undefined;
        });
    }
    getStaff(animeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/staff`);
            return rawData ? rawData.map((staffReference) => new anime_1.AnimeStaffReference(this.client, staffReference)) : undefined;
        });
    }
    getEpisodes(animeId, offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`anime/${animeId}/episodes`, offset, maxCount);
            return rawData ? rawData.map((partialEpisode) => new anime_1.AnimePartialEpisode(this.client, animeId, partialEpisode)) : undefined;
        });
    }
    getEpisode(animeId, episodeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/episodes/${episodeId}`);
            return rawData ? new anime_1.AnimeEpisode(this.client, animeId, rawData) : undefined;
        });
    }
    getNews(animeId, offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`anime/${animeId}/news`, offset, maxCount);
            return rawData ? rawData.map((news) => new base_2.ContentNews(this.client, news)) : undefined;
        });
    }
    getTopics(animeId, topic = 'all') {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/forum`, { topic });
            return rawData ? rawData.map((topic) => new anime_1.AnimeTopic(this.client, topic)) : undefined;
        });
    }
    getVideos(animeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/videos`);
            return rawData ? new anime_1.AnimeVideo(this.client, rawData) : undefined;
        });
    }
    getVideosEpisodes(animeId, offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`anime/${animeId}/videos/episodes`, offset, maxCount);
            return rawData ? rawData.map((episode) => new anime_1.AnimeEpisodeVideo(this.client, episode)) : undefined;
        });
    }
    getPictures(animeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/pictures`);
            return rawData ? rawData.map((picture) => new misc_1.Image(this.client, picture)) : undefined;
        });
    }
    getStatistics(animeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/statistics`);
            return rawData ? new anime_1.AnimeStatistics(this.client, rawData) : undefined;
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
            return rawData ? rawData.map((recommendation) => new anime_1.AnimeRecommendation(this.client, recommendation)) : undefined;
        });
    }
    getUserUpdates(animeId, offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`anime/${animeId}/userupdates`, offset, maxCount);
            return rawData ? rawData.map((userUpdate) => new anime_1.AnimeUserUpdate(this.client, userUpdate)) : undefined;
        });
    }
    getReviews(animeId, offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`anime/${animeId}/reviews`, offset, maxCount);
            return rawData ? rawData.map((review) => new anime_1.AnimeReview(this.client, review)) : undefined;
        });
    }
    getRelations(animeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`anime/${animeId}/relations`);
            return rawData ? rawData.map((relation) => new anime_1.AnimeRelationGroup(this.client, anime_1.AnimeRelationGroup.parseRelation(relation.relation), relation)) : undefined;
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
            return rawData ? rawData.map((external) => new base_2.ContentExternal(this.client, external)) : undefined;
        });
    }
    getStreamingLinks(animeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.request(`anime/${animeId}/streaming`);
        });
    }
}
exports.AnimeManager = AnimeManager;
