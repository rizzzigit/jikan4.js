"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationUser = exports.RecommendationManga = exports.RecommendationAnime = exports.BaseRecommendation = void 0;
const base_1 = require("./base");
const meta_1 = require("./meta");
class BaseRecommendation extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.content = data.content;
        this.date = BaseRecommendation.parseDate(data.date);
        this.user = new RecommendationUser(client, data.user);
    }
}
exports.BaseRecommendation = BaseRecommendation;
class RecommendationAnime extends BaseRecommendation {
    constructor(client, data) {
        var _a;
        super(client, data);
        this.entries = ((_a = data.entry) === null || _a === void 0 ? void 0 : _a.map((entry) => new meta_1.AnimeMeta(client, entry))) || [];
    }
}
exports.RecommendationAnime = RecommendationAnime;
class RecommendationManga extends BaseRecommendation {
    constructor(client, data) {
        var _a;
        super(client, data);
        this.entries = ((_a = data.entry) === null || _a === void 0 ? void 0 : _a.map((entry) => new meta_1.MangaMeta(client, entry))) || [];
    }
}
exports.RecommendationManga = RecommendationManga;
class RecommendationUser extends base_1.BaseClass {
    getUser() {
        return this.client.users.get(this.username);
    }
    constructor(client, data) {
        super(client);
        this.url = RecommendationUser.parseURL(data.url, false);
        this.username = data.username;
    }
}
exports.RecommendationUser = RecommendationUser;
