"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRecommendation = exports.UserFriend = exports.UserMangaHistory = exports.UserAnimeHistory = exports.UserContentUpdates = exports.UserMangaUpdate = exports.UserAnimeUpdate = exports.UserContentUpdate = exports.UserFavorites = exports.UserStats = exports.User = exports.UserMeta = void 0;
const Jikan_1 = require("../Jikan");
const base_1 = require("./base");
const meta_1 = require("./meta");
class UserMeta extends base_1.BaseClass {
    constructor(client, data) {
        var _a, _b;
        super(client);
        this.username = data.username;
        this.url = UserMeta.parseURL(data.url);
        this.imageUrl = UserMeta.parseURL((_b = (_a = data === null || data === void 0 ? void 0 : data.images) === null || _a === void 0 ? void 0 : _a.jpg) === null || _b === void 0 ? void 0 : _b.image_url, true);
        this.lastOnline = UserMeta.parseDate(data.last_online);
    }
    getUser() {
        return this.client.users.get(this.username);
    }
}
exports.UserMeta = UserMeta;
class User extends base_1.BaseClass {
    constructor(client, data) {
        var _a, _b;
        super(client);
        this.username = data.username;
        this.url = UserMeta.parseURL(data.url);
        this.imageUrl = UserMeta.parseURL((_b = (_a = data === null || data === void 0 ? void 0 : data.images) === null || _a === void 0 ? void 0 : _a.jpg) === null || _b === void 0 ? void 0 : _b.image_url, true);
        this.lastOnline = UserMeta.parseDate(data.last_online);
        this.gender = User.parseGender(data.gender);
        this.birthday = User.parseDate(data.birthday, true);
        this.location = data.location || null;
        this.joined = User.parseDate(data.joined, true);
    }
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
}
exports.User = User;
class UserStats extends base_1.BaseClass {
    constructor(client, username, data) {
        super(client);
        this.username = username;
        this.anime = {
            daysWatched: data.days_watched,
            meanScore: data.mean_score,
            watching: data.watching,
            completed: data.completed,
            onHold: data.on_hold,
            dropped: data.dropped,
            planToWatch: data.plan_to_watch,
            totalEntries: data.total_entries,
            rewatched: data.rewatched,
            episodesWatched: data.episodes_watched
        };
        this.manga = {
            daysRead: data.days_read,
            meanScore: data.mean_score,
            reading: data.reading,
            completed: data.completed,
            onHold: data.on_hold,
            dropped: data.dropped,
            planToRead: data.plan_to_read,
            totalEntries: data.total_entries,
            reread: data.reread,
            chaptersRead: data.chapters_read,
            volumesRead: data.volumes_read
        };
    }
    getUser() {
        return this.client.users.get(this.username);
    }
}
exports.UserStats = UserStats;
class UserFavorites extends base_1.BaseClass {
    constructor(client, username, data) {
        super(client);
        this.username = username;
        this.anime = data.anime.map((anime) => Object.assign(new meta_1.AnimeMeta(client, anime), { images: new Jikan_1.ContentImage(client, anime.images) }));
        this.manga = data.manga.map((manga) => Object.assign(new meta_1.MangaMeta(client, manga), { images: new Jikan_1.ContentImage(client, manga.images) }));
        this.characters = data.characters.map((character) => Object.assign(new meta_1.CharacterMeta(client, character), { images: new Jikan_1.ContentImage(client, character.images) }));
        this.people = data.people.map((person) => Object.assign(new meta_1.PersonMeta(client, person), { images: new Jikan_1.ContentImage(client, person.images) }));
    }
    getUser() {
        return this.client.users.get(this.username);
    }
}
exports.UserFavorites = UserFavorites;
class UserContentUpdate extends base_1.BaseClass {
    constructor(client, username, data) {
        super(client);
        this.username = username;
        this.score = data.score;
        this.status = data.status;
        this.date = UserContentUpdate.parseDate(data.date);
    }
    getUser() {
        return this.client.users.get(this.username);
    }
}
exports.UserContentUpdate = UserContentUpdate;
class UserAnimeUpdate extends UserContentUpdate {
    constructor(client, username, data) {
        super(client, username, data);
        this.anime = new meta_1.AnimeMeta(client, data.entry);
        this.episodesSeen = data.episodes_seen;
        this.episodesTotal = data.episodes_total;
    }
}
exports.UserAnimeUpdate = UserAnimeUpdate;
class UserMangaUpdate extends UserContentUpdate {
    constructor(client, username, data) {
        super(client, username, data);
        this.manga = new meta_1.MangaMeta(client, data.entry);
        this.chaptersRead = data.chapters_read;
        this.chaptersTotal = data.chapters_total;
        this.volumesRead = data.volumes_read;
        this.volumesTotal = data.volumes_total;
    }
}
exports.UserMangaUpdate = UserMangaUpdate;
class UserContentUpdates extends base_1.BaseClass {
    constructor(client, username, data) {
        super(client);
        this.username = username;
        this.anime = data.anime.map((anime) => new UserAnimeUpdate(client, username, anime));
        this.manga = data.manga.map((manga) => new UserMangaUpdate(client, username, manga));
    }
    getUser() {
        return this.client.users.get(this.username);
    }
}
exports.UserContentUpdates = UserContentUpdates;
class UserAnimeHistory extends base_1.BaseClass {
    constructor(client, username, data) {
        super(client);
        this.username = username;
        this.anime = new meta_1.AnimeMeta(client, data.entry);
        this.increment = data.increment;
        this.date = UserAnimeHistory.parseDate(data.date);
    }
    getUser() {
        return this.client.users.get(this.username);
    }
}
exports.UserAnimeHistory = UserAnimeHistory;
class UserMangaHistory extends base_1.BaseClass {
    constructor(client, username, data) {
        super(client);
        this.username = username;
        this.manga = new meta_1.MangaMeta(client, data.entry);
        this.increment = data.increment;
        this.date = UserMangaHistory.parseDate(data.date);
    }
    getUser() {
        return this.client.users.get(this.username);
    }
}
exports.UserMangaHistory = UserMangaHistory;
class UserFriend extends base_1.BaseClass {
    constructor(client, data) {
        var _a, _b;
        super(client);
        this.username = data.user.username;
        this.url = UserFriend.parseURL(data.user.url);
        this.imageUrl = UserFriend.parseURL((_b = (_a = data.user.images) === null || _a === void 0 ? void 0 : _a.jpg) === null || _b === void 0 ? void 0 : _b.image_url, true);
        this.lastOnline = UserFriend.parseDate(data.last_online);
        this.friendsSince = UserFriend.parseDate(data.friends_since, true);
    }
    getUser() {
        return this.client.users.get(this.username);
    }
}
exports.UserFriend = UserFriend;
class UserRecommendation extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.user = {
            url: UserRecommendation.parseURL(data.user.data.url),
            username: data.user.data.username
        };
        this.entry = Object.assign(((entry) => {
            if (entry.url.split('/')[3] === 'anime') {
                return new meta_1.AnimeMeta(client, entry);
            }
            else {
                return new meta_1.MangaMeta(client, entry);
            }
        })(data.entry), { images: new Jikan_1.ContentImage(client, data.entry.images) });
        this.id = data.mal_id;
        this.content = data.content;
    }
}
exports.UserRecommendation = UserRecommendation;
