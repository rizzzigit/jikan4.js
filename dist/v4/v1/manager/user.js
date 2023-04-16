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
exports.UserManager = void 0;
const user_1 = require("../resource/user");
const utils_1 = require("../utils");
const base_1 = require("./base");
const anime_1 = require("../resource/content/anime");
const manga_1 = require("../resource/content/manga");
const meta_1 = require("../resource/meta");
class UserManager extends base_1.BaseManager {
    search(searchString, filter, offset, maxCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('users', offset, maxCount, Object.assign({ q: searchString }, filter && (0, utils_1.translateObject)(filter, (key, value) => [key, value])));
            return rawData.map((user) => new user_1.User(this.client, user));
        });
    }
    list(offset, maxCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('users', offset, maxCount);
            return rawData.map((data) => new user_1.UserMeta(this.client, data));
        });
    }
    get(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`users/${username}`);
            return rawData ? new user_1.User(this.client, rawData) : undefined;
        });
    }
    getFull(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`users/${username}/full`);
            return rawData ? new user_1.UserFull(this.client, rawData) : undefined;
        });
    }
    getStatistics(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`users/${username}/statistics`);
            return rawData ? new user_1.UserStats(this.client, rawData) : undefined;
        });
    }
    getFavorites(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`users/${username}/favorites`);
            return rawData ? new user_1.UserFavorites(this.client, rawData) : undefined;
        });
    }
    getUpdates(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`users/${username}/userupdates`);
            return rawData ? new user_1.UserContentUpdates(this.client, rawData) : undefined;
        });
    }
    getAbout(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`users/${username}/about`);
            return rawData ? rawData.about : undefined;
        });
    }
    getHistory(username, type = 'all') {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`users/${username}/history${type !== 'all' ? `/${type}` : ''}`);
            return rawData.map((data) => {
                switch (data.entry.type) {
                    case 'manga': return new user_1.UserMangaHistory(this.client, data);
                    case 'anime': return new user_1.UserAnimeHistory(this.client, data);
                    default: throw new Error(`Unknown entry type: ${data.entry.type}`);
                }
            });
        });
    }
    getFriends(username, offset, maxCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`users/${username}/friends`, offset, maxCount);
            return rawData ? rawData.map((friend) => new user_1.UserFriend(this.client, friend)) : undefined;
        });
    }
    getReviews(username, offset, maxCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`users/${username}/reviews`, offset, maxCount);
            return rawData
                ? rawData.map((review) => {
                    if ('episodes_watched' in review) {
                        return new anime_1.AnimeReview(this.client, review);
                    }
                    else {
                        return new manga_1.MangaReview(this.client, review);
                    }
                })
                : undefined;
        });
    }
    getRecommendations(username, offset, maxCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`users/${username}/recommendations`, offset, maxCount);
            return rawData ? rawData.map((recommendation) => new user_1.UserRecommendation(this.client, recommendation)) : undefined;
        });
    }
    getClubs(username, offset, maxCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`users/${username}/clubs`, offset, maxCount);
            return rawData ? rawData.map((club) => new meta_1.ClubMeta(this.client, club)) : undefined;
        });
    }
    getExternal(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`users/${username}/external`);
            return rawData ? rawData.map((data) => Object.assign(data, { url: new URL(data.url) })) : undefined;
        });
    }
}
exports.UserManager = UserManager;
