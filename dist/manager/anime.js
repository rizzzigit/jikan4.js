"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimeManager = void 0;
const tslib_1 = require("tslib");
const base_1 = require("../manager/base");
const anime_1 = require("../resource/content/anime");
const misc_1 = require("../resource/misc");
const utils_1 = require("../utils");
const meta_1 = require("../resource/meta");
class AnimeManager extends base_1.BaseManager {
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    storeCache(data) {
        return super.storeCache(`anime/${data.mal_id}`, data);
    }
    search(searchString, filter, offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource('anime', offset, maxCount, Object.assign({ disableCaching: true, [searchString.length === 1 ? 'letter' : 'q']: searchString }, filter && (0, utils_1.translateObject)(filter, (key, value) => {
                switch (key) {
                    case 'score': return [key, `${value}`];
                    case 'minScore': return ['min_score', `${value}`];
                    case 'maxScore': return ['max_score', `${value}`];
                    case 'sfw': return [key, ''];
                    case 'genres': return [key, `${value.map((value) => value instanceof meta_1.AnimeGenreMeta ? value.id : value)}`];
                    case 'excludeGenres': return ['genres_exclude', `${value.map((value) => value instanceof meta_1.AnimeGenreMeta ? value.id : value)}`];
                    case 'producers': return ['producer', `${value.map((value) => value instanceof meta_1.ProducerMeta ? value.id : value)}`];
                    case 'orderBy': return ['order_by', `${value}`];
                    default: return [key, `${value}`];
                }
            })));
            return rawData.map((anime) => this.storeCache(anime)).map((anime) => new anime_1.Anime(this.client, anime));
        });
    }
    list(offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource('anime', offset, maxCount);
            return rawData.map((data) => this.storeCache(data)).map((anime) => new anime_1.Anime(this.client, anime));
        });
    }
    listTop(offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource('top/anime', offset, maxCount);
            return rawData.map((data) => this.storeCache(data)).map((anime) => new anime_1.Anime(this.client, anime));
        });
    }
    listRecommended(offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource('recommendations/anime', offset, maxCount);
            return rawData.map((data) => this.storeCache(data)).map((anime) => new anime_1.Anime(this.client, anime));
        });
    }
    listScheduled(offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource('schedules', offset, maxCount);
            return rawData.map((data) => this.storeCache(data)).map((anime) => new anime_1.Anime(this.client, anime));
        });
    }
    random() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource('random/anime', { disableCaching: 'true' });
            this.storeCache(rawData);
            return new anime_1.Anime(this.client, rawData);
        });
    }
    get(animeId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`anime/${animeId}`);
            return rawData ? new anime_1.Anime(this.client, rawData) : undefined;
        });
    }
    getCharacters(animeId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`anime/${animeId}/characters`);
            return rawData ? rawData.map((characterReference) => new anime_1.AnimeCharacterReference(this.client, animeId, characterReference)) : undefined;
        });
    }
    getStaff(animeId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`anime/${animeId}/staff`);
            return rawData ? rawData.map((staffReference) => new anime_1.AnimeStaffReference(this.client, animeId, staffReference)) : undefined;
        });
    }
    getEpisodes(animeId, offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource(`anime/${animeId}/episodes`, offset, maxCount);
            return rawData ? rawData.map((partialEpisode) => new anime_1.AnimePartialEpisode(this.client, animeId, partialEpisode)) : undefined;
        });
    }
    getEpisode(animeId, episodeID) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`anime/${animeId}/episodes/${episodeID}`);
            return rawData ? new anime_1.AnimeEpisode(this.client, animeId, rawData) : undefined;
        });
    }
    getNews(animeId, offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource(`anime/${animeId}/news`, offset, maxCount);
            return rawData ? rawData.map((news) => new anime_1.AnimeNews(this.client, animeId, news)) : undefined;
        });
    }
    getTopics(animeId, topic = 'all') {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`anime/${animeId}/forum`, { topic });
            return rawData ? rawData.map((topic) => new anime_1.AnimeTopic(this.client, animeId, topic)) : undefined;
        });
    }
    getVideos(animeId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`anime/${animeId}/videos`);
            return rawData ? new anime_1.AnimeVideo(this.client, animeId, rawData) : undefined;
        });
    }
    getPictures(animeId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`anime/${animeId}/pictures`);
            return rawData ? rawData.map((picture) => new misc_1.Image(this.client, picture)) : undefined;
        });
    }
    getStatistics(animeId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`anime/${animeId}/statistics`);
            return rawData ? new anime_1.AnimeStatistics(this.client, animeId, rawData) : undefined;
        });
    }
    getMoreInfo(animeId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`anime/${animeId}/moreinfo`);
            return rawData ? rawData.moreinfo || null : undefined;
        });
    }
    getRecommendations(animeId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`anime/${animeId}/recommendations`);
            return rawData ? rawData.map((recommendation) => new anime_1.AnimeRecommendation(this.client, animeId, recommendation)) : undefined;
        });
    }
    getUserUpdates(animeId, offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource(`anime/${animeId}/userupdates`, offset, maxCount);
            return rawData ? rawData.map((userUpdate) => new anime_1.AnimeUserUpdate(this.client, animeId, userUpdate)) : undefined;
        });
    }
    getReviews(animeId, offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource(`anime/${animeId}/reviews`, offset, maxCount);
            return rawData ? rawData.map((review) => new anime_1.AnimeReview(this.client, animeId, review)) : undefined;
        });
    }
    getRelations(animeId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`anime/${animeId}/relations`);
            return rawData ? rawData.map((relation) => new anime_1.AnimeRelationGroup(this.client, animeId, anime_1.AnimeRelationGroup.parseRelation(relation.relation), relation)) : undefined;
        });
    }
    getThemes(animeId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return yield this.requestResource(`anime/${animeId}/themes`);
        });
    }
}
exports.AnimeManager = AnimeManager;
