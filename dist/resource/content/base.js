"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentRelationGroup = exports.ContentUserUpdate = exports.ContentReview = exports.ContentReviewScores = exports.ContentUser = exports.ContentNews = exports.ContentStatistics = exports.ContentStatisticsScore = exports.Content = exports.ContentTitle = exports.ContentImage = void 0;
const base_1 = require("../base");
const misc_1 = require("../misc");
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
        var _a;
        super(client);
        this.default = ContentTitle.parseString(data.title);
        this.english = ContentTitle.parseString(data.english, true);
        this.japanese = ContentTitle.parseString(data.japanese, true);
        this.synonyms = ((_a = data.synonyms) === null || _a === void 0 ? void 0 : _a.map((synonym) => ContentTitle.parseString(synonym, true)).filter((synonym) => !!synonym)) || [];
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
        this.title = new ContentTitle(client, data);
        this.score = Content.parseNumber(data.score || data.scored, true);
        this.scoredBy = Content.parseNumber(data.scored_by, true);
        this.rank = Content.parseNumber(data.rank);
        this.popularity = Content.parseNumber(data.popularity);
        this.members = Content.parseNumber(data.members);
        this.favorites = Content.parseNumber(data.favorites);
        this.synopsis = Content.parseString(data.synopsis, true);
        this.background = Content.parseString(data.background, true);
    }
}
exports.Content = Content;
class ContentStatisticsScore extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.score = ContentStatisticsScore.parseNumber(data.score);
        this.votes = ContentStatisticsScore.parseNumber(data.votes);
        this.percentage = ContentStatisticsScore.parseNumber(data.percentage);
    }
}
exports.ContentStatisticsScore = ContentStatisticsScore;
class ContentStatistics extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.completed = ContentStatistics.parseNumber(data.completed);
        this.onHold = ContentStatistics.parseNumber(data.on_hold);
        this.dropped = ContentStatistics.parseNumber(data.dropped);
        this.total = ContentStatistics.parseNumber(data.total);
        this.scores = data.scores.map((score) => new ContentStatisticsScore(client, score));
    }
}
exports.ContentStatistics = ContentStatistics;
class ContentNews extends base_1.BaseResource {
    constructor(client, data) {
        var _a, _b;
        super(client, data);
        this.title = ContentNews.parseString(data.title);
        this.date = new Date(data.date);
        this.authorUsername = ContentNews.parseString(data.author_username);
        this.authorURL = ContentNews.parseURL(data.author_url);
        this.forumURL = ContentNews.parseURL(data.forum_url);
        this.imageURL = ContentNews.parseURL((_b = (_a = data.images) === null || _a === void 0 ? void 0 : _a.jpg) === null || _b === void 0 ? void 0 : _b.image_url, true);
        this.comments = ContentNews.parseNumber(data.comments);
        this.excerpt = ContentNews.parseString(data.excerpt);
    }
}
exports.ContentNews = ContentNews;
class ContentUser extends base_1.BaseClass {
    constructor(client, data) {
        var _a, _b;
        super(client);
        this.username = ContentUser.parseString(data.username);
        this.URL = ContentUser.parseURL(data.url);
        this.imageURL = ContentUser.parseURL((_b = (_a = data.images) === null || _a === void 0 ? void 0 : _a.jpg) === null || _b === void 0 ? void 0 : _b.image_url, true);
    }
}
exports.ContentUser = ContentUser;
class ContentReviewScores extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.overall = ContentReviewScores.parseNumber(data.overall);
        this.story = ContentReviewScores.parseNumber(data.story);
        this.character = ContentReviewScores.parseNumber(data.character);
        this.enjoyment = ContentReviewScores.parseNumber(data.enjoyment);
    }
}
exports.ContentReviewScores = ContentReviewScores;
class ContentReview extends base_1.BaseResource {
    constructor(client, data) {
        super(client, data);
        this.type = ContentReview.parseString(data.type);
        this.votes = ContentReview.parseNumber(data.votes);
        this.date = new Date(data.date);
        this.review = ContentReview.parseString(data.review);
        this.scores = new ContentReviewScores(client, data.scores);
        this.user = new ContentUser(client, data.user);
    }
}
exports.ContentReview = ContentReview;
class ContentUserUpdate extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.user = new ContentUser(client, data.user);
        this.score = ContentUserUpdate.parseNumber(data.score);
        this.status = ContentUserUpdate.parseString(data.status);
        this.date = new Date(data.date);
    }
}
exports.ContentUserUpdate = ContentUserUpdate;
class ContentRelationGroup extends base_1.BaseClass {
    constructor(client, relation, data) {
        super(client);
        this.relation = relation;
    }
    // eslint-disable-next-line tsdoc/syntax
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
            default:
                throw new Error(`Unknown relation: ${data}`);
        }
    }
}
exports.ContentRelationGroup = ContentRelationGroup;
