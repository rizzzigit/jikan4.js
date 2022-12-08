"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFull = exports.UserFriend = exports.User = exports.UserMeta = void 0;
const base_1 = require("../resource/content/base");
const base_2 = require("./base");
const meta_1 = require("./meta");
class UserMeta extends base_2.BaseClass {
    getUser() {
        return this.client.users.get(this.username);
    }
    constructor(client, data) {
        var _a, _b;
        super(client);
        this.username = data.username;
        this.url = UserMeta.parseURL(data.url);
        this.imageUrl = UserMeta.parseURL((_b = (_a = data === null || data === void 0 ? void 0 : data.images) === null || _a === void 0 ? void 0 : _a.jpg) === null || _b === void 0 ? void 0 : _b.image_url, true);
        this.lastOnline = UserMeta.parseDate(data.last_online);
    }
}
exports.UserMeta = UserMeta;
class User extends base_2.BaseClass {
    /** @hidden */
    static parseGender(input) {
        var _a;
        switch (((_a = input === null || input === void 0 ? void 0 : input.trim) === null || _a === void 0 ? void 0 : _a.call(input).toLowerCase()) || '') {
            case 'any': return 'Any';
            case 'male': return 'Male';
            case 'female': return 'Female';
            case 'nonbinary':
            default: return 'Non-binary';
        }
    }
    /** @hidden */
    static parseStats(data) {
        return {
            anime: {
                daysWatched: data.anime.days_watched,
                meanScore: data.anime.mean_score,
                watching: data.anime.watching,
                completed: data.anime.completed,
                onHold: data.anime.on_hold,
                dropped: data.anime.dropped,
                planToWatch: data.anime.plan_to_watch,
                totalEntries: data.anime.total_entries,
                rewatched: data.anime.rewatched,
                episodesWatched: data.anime.episodes_watched
            },
            manga: {
                daysRead: data.manga.days_read,
                meanScore: data.manga.mean_score,
                reading: data.manga.reading,
                completed: data.manga.completed,
                onHold: data.manga.on_hold,
                dropped: data.manga.dropped,
                planToRead: data.manga.plan_to_read,
                totalEntries: data.manga.total_entries,
                reread: data.manga.reread,
                chaptersRead: data.manga.chapters_read,
                volumesRead: data.manga.volumes_read
            }
        };
    }
    /** @hidden */
    static parseFavorites(client, data) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return {
            anime: (_b = (_a = data.anime) === null || _a === void 0 ? void 0 : _a.map((anime) => Object.assign(new meta_1.AnimeMeta(client, anime), { images: new base_1.ContentImage(client, anime.images) }))) !== null && _b !== void 0 ? _b : [],
            manga: (_d = (_c = data.manga) === null || _c === void 0 ? void 0 : _c.map((manga) => Object.assign(new meta_1.MangaMeta(client, manga), { images: new base_1.ContentImage(client, manga.images) }))) !== null && _d !== void 0 ? _d : [],
            characters: (_f = (_e = data.characters) === null || _e === void 0 ? void 0 : _e.map((character) => Object.assign(new meta_1.CharacterMeta(client, character), { images: new base_1.ContentImage(client, character.images) }))) !== null && _f !== void 0 ? _f : [],
            people: (_h = (_g = data.people) === null || _g === void 0 ? void 0 : _g.map((person) => Object.assign(new meta_1.PersonMeta(client, person), { images: new base_1.ContentImage(client, person.images) }))) !== null && _h !== void 0 ? _h : []
        };
    }
    /** @hidden */
    static parseContentUpdate(data) {
        return {
            score: data.score,
            status: data.status,
            date: this.parseDate(data.date)
        };
    }
    /** @hidden */
    static parseAnimeUpdate(client, data) {
        return {
            anime: new meta_1.AnimeMeta(client, data.entry),
            episodesSeen: data.episodes_seen,
            episodesTotal: data.episodes_total
        };
    }
    /** @hidden */
    static parseMangaUpdate(client, data) {
        return Object.assign(Object.assign({}, this.parseContentUpdate(data)), { manga: new meta_1.MangaMeta(client, data.entry), chaptersRead: data.chapters_read, chaptersTotal: data.chapters_total, volumesRead: data.volumes_read, volumesTotal: data.volumes_total });
    }
    /** @hidden */
    static parseContentUpdates(client, data) {
        var _a, _b;
        return {
            anime: ((_a = data.anime) === null || _a === void 0 ? void 0 : _a.map((anime) => this.parseAnimeUpdate(client, anime))) || [],
            manga: ((_b = data.manga) === null || _b === void 0 ? void 0 : _b.map((manga) => this.parseMangaUpdate(client, manga))) || []
        };
    }
    /** @hidden */
    static parseAnimeHistory(client, data) {
        return {
            anime: new meta_1.AnimeMeta(client, data.entry),
            increment: data.increment,
            date: this.parseDate(data.date)
        };
    }
    /** @hidden */
    static parseMangaHistory(client, data) {
        return {
            manga: new meta_1.MangaMeta(client, data.entry),
            increment: data.increment,
            date: this.parseDate(data.date)
        };
    }
    /** @hidden */
    static parseRecommendation(client, data) {
        return {
            user: {
                url: this.parseURL(data.user.url),
                username: data.user.username
            },
            entries: Object.assign(((entry) => (entry === null || entry === void 0 ? void 0 : entry.map((entry) => {
                if (entry.url.split('/')[3] === 'anime') {
                    return new meta_1.AnimeMeta(client, entry);
                }
                else {
                    return new meta_1.MangaMeta(client, entry);
                }
            })) || [])(data.entry), { images: new base_1.ContentImage(client, data.entry.images) }),
            content: data.content
        };
    }
    getStatistics() {
        return this.client.users.getStatistics(this.username);
    }
    getFavorites() {
        return this.client.users.getFavorites(this.username);
    }
    getUpdates() {
        return this.client.users.getUpdates(this.username);
    }
    getAbout() {
        return this.client.users.getAbout(this.username);
    }
    getHistory(type) {
        return this.client.users.getHistory(this.username, type);
    }
    getFriends(offset, maxCount) {
        return this.client.users.getFriends(this.username, offset, maxCount);
    }
    getRecommendations(offset, maxCount) {
        return this.client.users.getRecommendations(this.username, offset, maxCount);
    }
    getClubs(offset, maxCount) {
        return this.client.users.getClubs(this.username, offset, maxCount);
    }
    getExternal() {
        return this.client.users.getExternal(this.username);
    }
    getFull() {
        return this.client.users.getFull(this.username);
    }
    constructor(client, data) {
        var _a, _b;
        super(client);
        this.username = data.username;
        this.url = User.parseURL(data.url);
        this.imageUrl = User.parseURL((_b = (_a = data === null || data === void 0 ? void 0 : data.images) === null || _a === void 0 ? void 0 : _a.jpg) === null || _b === void 0 ? void 0 : _b.image_url, true);
        this.lastOnline = User.parseDate(data.last_online, true);
        this.gender = User.parseGender(data.gender);
        this.birthday = User.parseDate(data.birthday, true);
        this.location = data.location || null;
        this.joined = User.parseDate(data.joined, true);
    }
}
exports.User = User;
class UserFriend extends base_2.BaseClass {
    getUser() {
        return this.client.users.get(this.username);
    }
    constructor(client, data) {
        var _a, _b;
        super(client);
        this.username = data.user.username;
        this.url = UserFriend.parseURL(data.user.url);
        this.imageUrl = UserFriend.parseURL((_b = (_a = data.user.images) === null || _a === void 0 ? void 0 : _a.jpg) === null || _b === void 0 ? void 0 : _b.image_url, true);
        this.lastOnline = UserFriend.parseDate(data.last_online, true);
        this.friendsSince = UserFriend.parseDate(data.friends_since, true);
    }
}
exports.UserFriend = UserFriend;
class UserFull extends User {
    constructor(client, data) {
        var _a, _b, _c, _d;
        super(client, data);
        this.statistics = User.parseStats(data.statistics);
        this.external = data.external.map((data) => Object.assign(data, { url: new URL(data.url) }));
        this.updates = {
            manga: ((_b = (_a = data.updates) === null || _a === void 0 ? void 0 : _a.manga) === null || _b === void 0 ? void 0 : _b.map((update) => User.parseMangaUpdate(client, update))) || [],
            anime: ((_d = (_c = data.updates) === null || _c === void 0 ? void 0 : _c.anime) === null || _d === void 0 ? void 0 : _d.map((update) => User.parseAnimeUpdate(client, update))) || []
        };
    }
}
exports.UserFull = UserFull;
