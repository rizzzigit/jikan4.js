"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const tslib_1 = require("tslib");
const user_1 = require("../resource/user");
const utils_1 = require("../utils");
const base_1 = require("./base");
const anime_1 = require("../resource/content/anime");
const manga_1 = require("../resource/content/manga");
const meta_1 = require("../resource/meta");
class UserManager extends base_1.BaseManager {
    search(searchString, filter, offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('users', offset, maxCount, Object.assign({ q: searchString }, filter && (0, utils_1.translateObject)(filter, (key, value) => [key, value])));
            return rawData.map((user) => new user_1.User(this.client, user));
        });
    }
    list(offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('users', offset, maxCount);
            return rawData.map((data) => new user_1.UserMeta(this.client, data));
        });
    }
    get(username) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`users/${username}`);
            return rawData ? new user_1.User(this.client, rawData) : undefined;
        });
    }
    getFull(username) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`users/${username}/full`);
            return rawData ? new user_1.UserFull(this.client, rawData) : undefined;
        });
    }
    getStatistics(username) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`users/${username}/statistics`);
            return rawData ? user_1.User.parseStats(rawData) : undefined;
        });
    }
    getFavorites(username) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`users/${username}/favorites`);
            return rawData ? user_1.User.parseFavorites(this.client, rawData) : undefined;
        });
    }
    getUpdates(username) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`users/${username}/userupdates`);
            return rawData ? user_1.User.parseContentUpdates(this.client, rawData) : undefined;
        });
    }
    getAbout(username) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`users/${username}/about`);
            return rawData ? rawData.about : undefined;
        });
    }
    getHistory(username, type = 'all') {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`users/${username}/history${type !== 'all' ? `/${type}` : ''}`);
            return rawData.map((data) => {
                switch (data.entry.type) {
                    case 'manga': return user_1.User.parseMangaHistory(this.client, data);
                    case 'anime': return user_1.User.parseAnimeHistory(this.client, data);
                    default: throw new Error(`Unknown entry type: ${data.entry.type}`);
                }
            });
        });
    }
    getFriends(username, offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`users/${username}/friends`, offset, maxCount);
            return rawData ? rawData.map((friend) => new user_1.UserFriend(this.client, friend)) : undefined;
        });
    }
    getReviews(username, offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`users/${username}/reviews`, offset, maxCount);
            return rawData
                ? rawData.map((review) => {
                    if ('episodes_watched' in review) {
                        return anime_1.Anime.parseReview(review);
                    }
                    else {
                        return manga_1.Manga.parseReview(review);
                    }
                })
                : undefined;
        });
    }
    getRecommendations(username, offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`users/${username}/recommendations`, offset, maxCount);
            return rawData ? rawData.map((recommendation) => user_1.User.parseRecommendation(this.client, recommendation)) : undefined;
        });
    }
    getClubs(username, offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`users/${username}/clubs`, offset, maxCount);
            return rawData ? rawData.map((club) => new meta_1.ClubMeta(this.client, club)) : undefined;
        });
    }
    getExternal(username) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`users/${username}/external`);
            return rawData ? rawData.map((data) => Object.assign(data, { url: new URL(data.url) })) : undefined;
        });
    }
}
exports.UserManager = UserManager;
