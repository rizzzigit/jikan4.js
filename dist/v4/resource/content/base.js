"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentExternal = exports.ContentRelationGroup = exports.ContentUserUpdate = exports.ContentReview = exports.ContentReactions = exports.ContentUser = exports.ContentNews = exports.ContentStatistics = exports.ContentStatisticsScore = exports.Content = exports.ContentTitle = void 0;
const base_1 = require("../base");
const misc_1 = require("../misc");
class ContentTitle extends base_1.BaseClass {
    toString() {
        return this.default;
    }
    constructor(client, data) {
        super(client);
        this.synonyms = [];
        this.english = null;
        this.japanese = null;
        this.german = null;
        this.spanish = null;
        this.french = null;
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
                case 'German':
                    this.german = titleTrimmed;
                    break;
                case 'Spanish':
                    this.spanish = titleTrimmed;
                    break;
                case 'French':
                    this.french = titleTrimmed;
                    break;
                case 'Synonym':
                    this.synonyms.push(titleTrimmed);
                    break;
            }
        }
    }
}
exports.ContentTitle = ContentTitle;
class Content extends base_1.BaseResource {
    constructor(client, data) {
        super(client, data);
        this.image = new misc_1.ImageFormatCollection(client, data.images);
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
        super(client, data);
        this.title = data.title;
        this.date = new Date(data.date);
        this.authorUsername = data.author_username;
        this.authorURL = ContentNews.parseURL(data.author_url);
        this.forumURL = ContentNews.parseURL(data.forum_url);
        this.image = data.images != null ? new misc_1.ImageFormatCollection(client, data.images) : null;
        this.comments = data.comments;
        this.excerpt = data.excerpt;
    }
}
exports.ContentNews = ContentNews;
class ContentUser extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.username = data.username;
        this.url = ContentUser.parseURL(data.url);
        this.image = data.images != null ? new misc_1.ImageFormatCollection(client, data.images) : null;
    }
}
exports.ContentUser = ContentUser;
class ContentReactions extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.overall = data.overall;
        this.nice = data.nice;
        this.loveIt = data.love_it;
        this.funny = data.funny;
        this.confusing = data.confusing;
        this.informative = data.informative;
        this.wellWritten = data.well_written;
        this.creative = data.creative;
    }
}
exports.ContentReactions = ContentReactions;
class ContentReview extends base_1.BaseResource {
    constructor(client, data) {
        super(client, data);
        this.type = data.type;
        this.score = data.score;
        this.date = new Date(data.date);
        this.review = data.review;
        this.reactions = new ContentReactions(client, data.reactions);
        this.user = new ContentUser(client, data.user);
        this.isSpoiler = data.is_spoiler;
        this.isPreliminary = data.is_preliminary;
        this.tags = data.tags;
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
    constructor(client, relation) {
        super(client);
        this.relation = relation;
    }
}
exports.ContentRelationGroup = ContentRelationGroup;
class ContentExternal extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.name = data.name;
        this.url = data.url && new URL(data.url);
    }
}
exports.ContentExternal = ContentExternal;
