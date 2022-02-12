"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const tslib_1 = require("tslib");
const Jikan_1 = require("../Jikan");
const user_1 = require("../resource/user");
const utils_1 = require("../utils");
const base_1 = require("./base");
class UserManager extends base_1.BaseManager {
    search(searchString, filter, offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource('users', offset, maxCount, Object.assign({ disableCaching: 'true', q: searchString }, filter && (0, utils_1.translateObject)(filter, (key, value) => [key, value])));
            return rawData.map((user) => new user_1.User(this.client, user));
        });
    }
    list(offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource('users', offset, maxCount);
            return rawData.map((data) => new user_1.UserMeta(this.client, data));
        });
    }
    get(username) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`users/${username}`);
            return rawData ? new user_1.User(this.client, rawData) : undefined;
        });
    }
    getStatistics(username) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`users/${username}/statistics`);
            return rawData ? new user_1.UserStats(this.client, username, rawData) : undefined;
        });
    }
    getFavorites(username) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`users/${username}/favorites`);
            return rawData ? new user_1.UserFavorites(this.client, username, rawData) : undefined;
        });
    }
    getUpdates(username) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`users/${username}/userupdates`);
            return rawData ? new user_1.UserContentUpdates(this.client, username, rawData) : undefined;
        });
    }
    getAbout(username) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`users/${username}/about`);
            return rawData ? rawData.about : undefined;
        });
    }
    getHistory(username, type = 'all') {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`users/${username}/history${type !== 'all' ? `/${type}` : ''}`);
            return rawData.map((data) => {
                switch (data.entry.type) {
                    case 'manga': return new Jikan_1.MangaMeta(this.client, data);
                    case 'anime': return new Jikan_1.AnimeMeta(this.client, data);
                    default: throw new Error(`Unknown entry type: ${data.entry.type}`);
                }
            });
        });
    }
    getFriends(username, offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource(`users/${username}/friends`, offset, maxCount);
            return rawData.map((friend) => new user_1.UserFriend(this.client, friend));
        });
    }
    getReviews(username, offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource(`users/${username}/reviews`, offset, maxCount);
            return rawData.map((review) => {
                if ('episodes_watched' in review) {
                    return new Jikan_1.AnimeReview(this.client, review.anime.mal_id, review);
                }
                else {
                    return new Jikan_1.MangaReview(this.client, review.manga.mal_id, review);
                }
            });
        });
    }
    getRecommendations(username, offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource(`users/${username}/recommendations`, offset, maxCount);
            return rawData.map((recommendation) => new user_1.UserRecommendation(this.client, recommendation));
        });
    }
    getClubs(username, offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource(`users/${username}/clubs`, offset, maxCount);
            return rawData.map((club) => new Jikan_1.Club(this.client, club));
        });
    }
}
exports.UserManager = UserManager;
