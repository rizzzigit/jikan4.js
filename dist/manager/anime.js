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
            const rawData = yield this.requestPaginatedResource('anime', offset, maxCount, Object.assign({ [searchString.length === 1 ? 'letter' : 'q']: searchString }, filter && (0, utils_1.translateObject)(filter, (key, value) => {
                switch (key) {
                    case 'score': return [key, `${value}`];
                    case 'minScore': return ['min_score', `${value}`];
                    case 'maxScore': return ['max_score', `${value}`];
                    case 'sfw': return [key, ''];
                    case 'genres': return [key, `${value.map((value) => value instanceof meta_1.AnimeGenreMeta ? value.ID : value)}`];
                    case 'excludeGenres': return ['genres_exclude', `${value.map((value) => value instanceof meta_1.AnimeGenreMeta ? value.ID : value)}`];
                    case 'producers': return ['producer', `${value.map((value) => value instanceof meta_1.ProducerMeta ? value.ID : value)}`];
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
    get(animeID) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`anime/${animeID}`);
            return rawData ? new anime_1.Anime(this.client, rawData) : undefined;
        });
    }
    getCharacters(animeID) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`anime/${animeID}/characters`);
            return rawData ? rawData.map((characterReference) => new anime_1.AnimeCharacterReference(this.client, animeID, characterReference)) : undefined;
        });
    }
    getStaff(animeID) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`anime/${animeID}/staff`);
            return rawData ? rawData.map((staffReference) => new anime_1.AnimeStaffReference(this.client, animeID, staffReference)) : undefined;
        });
    }
    getEpisodes(animeID, offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource(`anime/${animeID}/episodes`, offset, maxCount);
            return rawData ? rawData.map((partialEpisode) => new anime_1.AnimePartialEpisode(this.client, animeID, partialEpisode)) : undefined;
        });
    }
    getEpisode(animeID, episodeID) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`anime/${animeID}/episodes/${episodeID}`);
            return rawData ? new anime_1.AnimeEpisode(this.client, animeID, rawData) : undefined;
        });
    }
    getNews(animeID, offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource(`anime/${animeID}/news`, offset, maxCount);
            return rawData ? rawData.map((news) => new anime_1.AnimeNews(this.client, animeID, news)) : undefined;
        });
    }
    getTopics(animeID, topic = 'all') {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`anime/${animeID}/forum`, { topic });
            return rawData ? rawData.map((topic) => new anime_1.AnimeTopic(this.client, animeID, topic)) : undefined;
        });
    }
    getVideos(animeID) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`anime/${animeID}/videos`);
            return rawData ? new anime_1.AnimeVideo(this.client, animeID, rawData) : undefined;
        });
    }
    getPictures(animeID) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`anime/${animeID}/pictures`);
            return rawData ? rawData.map((picture) => new misc_1.Image(this.client, picture)) : undefined;
        });
    }
    getStatistics(animeID) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`anime/${animeID}/statistics`);
            return rawData ? new anime_1.AnimeStatistics(this.client, animeID, rawData) : undefined;
        });
    }
    getMoreInfo(animeID) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`anime/${animeID}/moreinfo`);
            return rawData ? rawData.moreinfo || null : undefined;
        });
    }
    getRecommendations(animeID) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`anime/${animeID}/recommendations`);
            return rawData ? rawData.map((recommendation) => new anime_1.AnimeRecommendation(this.client, animeID, recommendation)) : undefined;
        });
    }
    getUserUpdates(animeID, offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource(`anime/${animeID}/userupdates`, offset, maxCount);
            return rawData ? rawData.map((userUpdate) => new anime_1.AnimeUserUpdate(this.client, animeID, userUpdate)) : undefined;
        });
    }
    getReviews(animeID, offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource(`anime/${animeID}/reviews`, offset, maxCount);
            return rawData ? rawData.map((review) => new anime_1.AnimeReview(this.client, animeID, review)) : undefined;
        });
    }
    getRelations(animeID) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`anime/${animeID}/relations`);
            return rawData ? rawData.map((relation) => new anime_1.AnimeRelationGroup(this.client, animeID, anime_1.AnimeRelationGroup.parseRelation(relation.relation), relation)) : undefined;
        });
    }
    getThemes(animeID) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return yield this.requestResource(`anime/${animeID}/themes`);
        });
    }
}
exports.AnimeManager = AnimeManager;
