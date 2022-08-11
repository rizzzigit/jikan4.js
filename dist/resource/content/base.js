"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentExternal = exports.ContentRelationGroup = exports.ContentUserUpdate = exports.ContentReview = exports.ContentReviewScores = exports.ContentUser = exports.ContentNews = exports.ContentStatistics = exports.ContentStatisticsScore = exports.Content = exports.ContentTitle = exports.ContentImage = void 0;
const base_1 = require("../base");
const misc_1 = require("../misc");
const url_1 = require("url");
class ContentImage extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.jpg = new misc_1.Image(client, data === null || data === void 0 ? void 0 : data.jpg);
        this.webp = new misc_1.Image(client, data === null || data === void 0 ? void 0 : data.webp);
    }
}
exports.ContentImage = ContentImage;
class ContentTitle extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.synonyms = [];
        this.english = null;
        this.japanese = null;
        this.default = '(no title)';
        for (const { type, title } of data) {
            const titleTrimmed = title.trim();
            if (!titleTrimmed) {
                continue;
            }
            switch (type) {
                case 'Default':
                    this.default = titleTrimmed;
                    break;
                case 'Japanese':
                    this.japanese = titleTrimmed;
                    break;
                case 'English':
                    this.english = titleTrimmed;
                    break;
                case 'Synonym':
                    this.synonyms.push(titleTrimmed);
                    break;
            }
        }
    }
    toString() {
        return this.default;
    }
}
exports.ContentTitle = ContentTitle;
class Content extends base_1.BaseResource {
    constructor(client, data) {
        super(client, data);
        this.image = new ContentImage(client, data.images);
        this.title = new ContentTitle(client, data.titles);
        this.titles = data.titles;
        this.score = data.score || data.scored || null;
        this.scoredBy = data.scored_by || null;
        this.rank = data.rank;
        this.popularity = data.popularity;
        this.members = data.members;
        this.favorites = data.favorites;
        this.synopsis = data.synopsis || null;
        this.background = data.background || null;
        this.approved = data.approved;
    }
}
exports.Content = Content;
class ContentStatisticsScore extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.score = data.score;
        this.votes = data.votes;
        this.percentage = data.percentage;
    }
}
exports.ContentStatisticsScore = ContentStatisticsScore;
class ContentStatistics extends base_1.BaseClass {
    constructor(client, data) {
        var _a;
        super(client);
        this.completed = data.completed;
        this.onHold = data.on_hold;
        this.dropped = data.dropped;
        this.total = data.total;
        this.scores = ((_a = data.scores) === null || _a === void 0 ? void 0 : _a.map((score) => new ContentStatisticsScore(client, score))) || [];
    }
}
exports.ContentStatistics = ContentStatistics;
class ContentNews extends base_1.BaseResource {
    constructor(client, data) {
        var _a, _b;
        super(client, data);
        this.title = data.title;
        this.date = new Date(data.date);
        this.authorUsername = data.author_username;
        this.authorURL = ContentNews.parseURL(data.author_url);
        this.forumURL = ContentNews.parseURL(data.forum_url);
        this.imageURL = ContentNews.parseURL((_b = (_a = data.images) === null || _a === void 0 ? void 0 : _a.jpg) === null || _b === void 0 ? void 0 : _b.image_url, true);
        this.comments = data.comments;
        this.excerpt = data.excerpt;
    }
}
exports.ContentNews = ContentNews;
class ContentUser extends base_1.BaseClass {
    constructor(client, data) {
        var _a, _b;
        super(client);
        this.username = data.username;
        this.url = ContentUser.parseURL(data.url);
        this.imageUrl = ContentUser.parseURL((_b = (_a = data.images) === null || _a === void 0 ? void 0 : _a.jpg) === null || _b === void 0 ? void 0 : _b.image_url, true);
    }
}
exports.ContentUser = ContentUser;
class ContentReviewScores extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.overall = data.overall;
        this.story = data.story;
        this.character = data.character;
        this.enjoyment = data.enjoyment;
    }
}
exports.ContentReviewScores = ContentReviewScores;
class ContentReview extends base_1.BaseResource {
    constructor(client, data) {
        super(client, data);
        this.type = data.type;
        this.votes = data.votes;
        this.date = new Date(data.date);
        this.review = data.review;
        this.scores = new ContentReviewScores(client, data.scores);
        this.user = new ContentUser(client, data.user);
    }
}
exports.ContentReview = ContentReview;
class ContentUserUpdate extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.user = new ContentUser(client, data.user);
        this.score = data.score;
        this.status = data.status;
        this.date = new Date(data.date);
    }
}
exports.ContentUserUpdate = ContentUserUpdate;
class ContentRelationGroup extends base_1.BaseClass {
    constructor(client, relation, data) {
        super(client);
        this.relation = relation;
    }
    /** @hidden */
    static parseRelation(data) {
        switch ((data === null || data === void 0 ? void 0 : data.toLowerCase().trim()) || 'any') {
            case 'adaptation': return 'Adaptation';
            case 'side story': return 'SideStory';
            case 'summary': return 'Summary';
            case 'sequel': return 'Sequel';
            case 'prequel': return 'Prequel';
            case 'character': return 'Character';
            case 'other': return 'Other';
            case 'alternative setting': return 'AlternativeSetting';
            case 'alternative version': return 'AlternativeVersion';
            case 'spin-off': return 'SpinOff';
            case 'full story': return 'FullStory';
            case 'parent story': return 'ParentStory';
            default: return 'Unknown';
        }
    }
}
exports.ContentRelationGroup = ContentRelationGroup;
class ContentExternal extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.name = data.name;
        this.url = data.url && new url_1.URL(data.url);
    }
}
exports.ContentExternal = ContentExternal;
