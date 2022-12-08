"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Content = exports.ContentTitle = exports.ContentImage = void 0;
const base_1 = require("../base");
class ContentImage extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.jpg = ContentImage.parseImage(data === null || data === void 0 ? void 0 : data.jpg);
        this.webp = ContentImage.parseImage(data === null || data === void 0 ? void 0 : data.webp);
    }
}
exports.ContentImage = ContentImage;
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
    static parseStatisticsScore(data) {
        return {
            score: data.score,
            votes: data.votes,
            percentage: data.percentage
        };
    }
    /** @hidden */
    static parseStatistics(data) {
        var _a;
        return {
            completed: data.completed,
            onHold: data.on_hold,
            dropped: data.dropped,
            total: data.total,
            scores: (_a = data.scores) === null || _a === void 0 ? void 0 : _a.map((score) => this.parseStatisticsScore(score))
        };
    }
    /** @hidden */
    static parseUserUpdate(data) {
        return {
            user: this.parseUser(data.user),
            score: data.score,
            status: data.status,
            date: new Date(data.date)
        };
    }
    /** @hidden */
    static parseUser(data) {
        var _a, _b;
        return {
            username: data.username,
            url: data.url,
            imageUrl: Content.parseURL((_b = (_a = data.images) === null || _a === void 0 ? void 0 : _a.jpg) === null || _b === void 0 ? void 0 : _b.image_url, true)
        };
    }
    /** @hidden */
    static parseReview(data) {
        return {
            id: data.mal_id,
            url: Content.parseURL(data.url),
            type: data.type,
            votes: data.votes,
            date: new Date(data.date),
            review: data.review,
            reactions: this.parseReactions(data.reactions),
            user: this.parseUser(data.user),
            isSpoiler: data.is_spoiler,
            isPreliminary: data.is_preliminary,
            tags: data.tags
        };
    }
    /** @hidden */
    static parseNews(data) {
        var _a, _b;
        return {
            id: data.mal_id,
            url: data.url,
            title: data.title,
            date: new Date(data.date),
            authorUsername: data.author_username,
            authorURL: this.parseURL(data.author_url),
            forumURL: this.parseURL(data.forum_url),
            imageURL: this.parseURL((_b = (_a = data.data.images) === null || _a === void 0 ? void 0 : _a.jpg) === null || _b === void 0 ? void 0 : _b.image_url, true),
            comments: data.comments,
            excerpt: data.excerpt
        };
    }
    /** @hidden */
    static parseReactions(data) {
        return {
            overall: data.overall,
            nice: data.nice,
            loveIt: data.love_it,
            funny: data.funny,
            confusing: data.confusing,
            informative: data.informative,
            wellWritten: data.well_written,
            creative: data.creative
        };
    }
    /** @hidden */
    static parseRelationType(data) {
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
    /** @hidden */
    static parseRelationGroup(client, relation, data) {
        return { relation };
    }
    /** @hidden */
    static parseExternal(data) {
        return {
            name: data.name,
            url: this.parseURL(data.url, true)
        };
    }
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
