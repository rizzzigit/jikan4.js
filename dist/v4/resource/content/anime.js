"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimeFull = exports.AnimeRelationGroup = exports.AnimeReview = exports.AnimeUserUpdate = exports.AnimeRecommendation = exports.AnimeStatistics = exports.AnimeVideo = exports.AnimeMusicVideo = exports.AnimeEpisodeVideo = exports.AnimePromo = exports.AnimeTopic = exports.AnimePartialEpisode = exports.AnimeEpisode = exports.AnimeEpisodeTitle = exports.AnimeStaffReference = exports.AnimeCharacterReference = exports.AnimeVoiceActorReference = exports.AnimeBroadcast = exports.Anime = exports.AnimeAirInformation = void 0;
const base_1 = require("./base");
const base_2 = require("../base");
const misc_1 = require("../misc");
const meta_1 = require("../meta");
const parse_duration_1 = __importDefault(require("parse-duration"));
const genre_1 = require("../../manager/genre");
class AnimeAirInformation extends base_2.BaseClass {
    /** @hidden */
    static parseStatus(input) {
        const status = input === null || input === void 0 ? void 0 : input.toLowerCase().trim();
        switch (status) {
            case 'finished airing': return 'Finished Airing';
            case 'currently airing': return 'Airing';
            case 'not yet aired': return 'Not Yet Aired';
            default: return 'Unknown';
        }
    }
    constructor(client, data) {
        super(client);
        this.status = AnimeAirInformation.parseStatus(data.status);
        this.airing = !!data.airing;
        this.airedFrom = AnimeAirInformation.parseDate(data.aired.from, true);
        this.airedTo = AnimeAirInformation.parseDate(data.aired.to, true);
    }
}
exports.AnimeAirInformation = AnimeAirInformation;
class Anime extends base_1.Content {
    /** @hidden */
    static parseType(input) {
        switch (input === null || input === void 0 ? void 0 : input.toLowerCase().trim()) {
            case 'tv': return 'TV';
            case 'ova': return 'OVA';
            case 'movie': return 'Movie';
            case 'special': return 'Special';
            case 'ona': return 'ONA';
            case 'music': return 'Music';
            case 'cm': return 'CM';
            case 'pv': return 'PV';
            case 'tv special': return 'TV Special';
            case 'unknow':
            case 'unknown':
            case '-':
            default: return 'Unknown';
        }
    }
    /** @hidden */
    static parseRating(input) {
        switch (input === null || input === void 0 ? void 0 : input.toLowerCase().trim()) {
            case 'none': return 'None';
            case 'g - all ages': return 'G';
            case 'pg - childre': return 'PG';
            case 'pg - children': return 'PG';
            case 'pg-13 - teens 13 or older': return 'PG-13+';
            case 'r - 17+ (violence & profanity)': return 'R-17+';
            case 'r+ - mild nudity': return 'R+';
            case 'rx - hentai': return 'Rx';
            default: return 'Unknown';
        }
    }
    /** @hidden */
    static parseSeason(input) {
        switch (input) {
            case 'summer': return 'Summer';
            case 'winter': return 'Winter';
            case 'spring': return 'Spring';
            case 'fall': return 'Fall';
            default: return 'Unknown';
        }
    }
    get isExplicit() {
        return !!(['Rx', 'R-17+'].includes(this.rating) ||
            this.genres.find((genre) => !!genre_1.animeExplicitGenres.find((genreEntry) => genreEntry[0] === genre.id)));
    }
    getCharacters() {
        return this.client.anime.getCharacters(this.id);
    }
    getStaff() {
        return this.client.anime.getStaff(this.id);
    }
    getEpisodes(offset, maxCount) {
        return this.client.anime.getEpisodes(this.id, offset, maxCount);
    }
    getEpisode(episodeId) {
        return this.client.anime.getEpisode(this.id, episodeId);
    }
    getNews(offset, maxCount) {
        return this.client.anime.getNews(this.id, offset, maxCount);
    }
    getTopics(topic) {
        return this.client.anime.getTopics(this.id, topic);
    }
    getVideos() {
        return this.client.anime.getVideos(this.id);
    }
    getVideosEpisodes(offset, maxCount) {
        return this.client.anime.getVideosEpisodes(this.id, offset, maxCount);
    }
    getPictures() {
        return this.client.anime.getPictures(this.id);
    }
    getStatistics() {
        return this.client.anime.getStatistics(this.id);
    }
    getMoreInfo() {
        return this.client.anime.getMoreInfo(this.id);
    }
    getRecommendations() {
        return this.client.anime.getRecommendations(this.id);
    }
    getUserUpdates(offset, maxCount) {
        return this.client.anime.getUserUpdates(this.id, offset, maxCount);
    }
    getReviews(offset, maxCount) {
        return this.client.anime.getReviews(this.id, offset, maxCount);
    }
    getRelations() {
        return this.client.anime.getRelations(this.id);
    }
    getThemes() {
        return this.client.anime.getThemes(this.id);
    }
    getExternal() {
        return this.client.anime.getExternal(this.id);
    }
    getStreamingLinks() {
        return this.client.anime.getStreamingLinks(this.id);
    }
    getFull() {
        return this.client.anime.getFull(this.id);
    }
    constructor(client, data) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        super(client, data);
        this.trailer = data.trailer ? new misc_1.YoutubeVideo(client, data.trailer) : null;
        this.type = Anime.parseType(data.type);
        this.source = data.source || null;
        this.episodes = (_a = data.episodes) !== null && _a !== void 0 ? _a : null;
        this.airInfo = new AnimeAirInformation(client, data);
        this.duration = (0, parse_duration_1.default)(data.duration, 'millisecond') || null;
        this.rating = Anime.parseRating(data.rating);
        this.season = Anime.parseSeason(data.season);
        this.year = data.year || null;
        this.producers = ((_b = data.producers) === null || _b === void 0 ? void 0 : _b.map((producer) => new meta_1.ProducerMeta(this.client, producer))) || [];
        this.licensors = ((_c = data.licensors) === null || _c === void 0 ? void 0 : _c.map((licensor) => new meta_1.ProducerMeta(this.client, licensor))) || [];
        this.studios = ((_d = data.studios) === null || _d === void 0 ? void 0 : _d.map((studio) => new meta_1.ProducerMeta(this.client, studio))) || [];
        this.genres = ((_e = data.genres) === null || _e === void 0 ? void 0 : _e.map((genre) => new meta_1.AnimeGenreMeta(this.client, genre, 'Genre'))) || [];
        this.explicitGenres = ((_f = data.explicit_genres) === null || _f === void 0 ? void 0 : _f.map((genre) => new meta_1.AnimeGenreMeta(this.client, genre, 'Explicit'))) || [];
        this.demographics = ((_g = data.demographics) === null || _g === void 0 ? void 0 : _g.map((genre) => new meta_1.AnimeGenreMeta(this.client, genre, 'Demographic'))) || [];
        this.themes = ((_h = data.themes) === null || _h === void 0 ? void 0 : _h.map((genre) => new meta_1.AnimeGenreMeta(this.client, genre, 'Theme'))) || [];
        this.broadcast = new AnimeBroadcast(client, data.broadcast);
    }
}
exports.Anime = Anime;
class AnimeBroadcast extends base_2.BaseClass {
    constructor(client, data) {
        super(client);
        this.day = data.day;
        this.time = data.time;
        this.timezone = data.timezone;
        this.string = data.string;
    }
}
exports.AnimeBroadcast = AnimeBroadcast;
class AnimeVoiceActorReference extends base_2.BaseClass {
    constructor(client, data) {
        super(client);
        this.language = data.language;
        this.person = new meta_1.PersonMeta(client, data.person);
    }
}
exports.AnimeVoiceActorReference = AnimeVoiceActorReference;
class AnimeCharacterReference extends base_2.BaseClass {
    constructor(client, data) {
        var _a;
        super(client);
        this.role = data.role;
        this.character = new meta_1.CharacterMeta(client, data.character);
        this.voiceActors = ((_a = data.voice_actors) === null || _a === void 0 ? void 0 : _a.map((voiceActor) => new AnimeVoiceActorReference(this.client, voiceActor))) || [];
    }
}
exports.AnimeCharacterReference = AnimeCharacterReference;
class AnimeStaffReference extends base_2.BaseClass {
    constructor(client, data) {
        super(client);
        this.positions = data.positions.filter((position) => !!position);
        this.person = new meta_1.PersonMeta(client, data.person);
    }
}
exports.AnimeStaffReference = AnimeStaffReference;
class AnimeEpisodeTitle extends base_2.BaseClass {
    toString() {
        return this.default;
    }
    constructor(client, data) {
        super(client);
        this.default = data.title;
        this.japanese = data.japanese || null;
        this.romanji = data.romanji || null;
    }
}
exports.AnimeEpisodeTitle = AnimeEpisodeTitle;
class AnimeEpisode extends base_2.BaseClass {
    constructor(client, animeId, data) {
        super(client);
        this.animeId = animeId;
        this.episodeId = data.mal_id;
        this.URL = AnimeEpisode.parseURL(data.url, true);
        this.title = new AnimeEpisodeTitle(client, data);
        this.duration = data.duration || null;
        this.aired = data.aired ? new Date(data.aired) : null;
        this.filler = !!data.filler;
        this.recap = !!data.recap;
        this.synopsis = data.synopsis || null;
    }
}
exports.AnimeEpisode = AnimeEpisode;
class AnimePartialEpisode extends AnimeEpisode {
    getFullEpisode() {
        return this.client.anime.getEpisode(this.animeId, this.episodeId);
    }
    constructor(client, animeId, data) {
        super(client, animeId, data);
        this.synopsis = null;
        this.forumUrl = AnimePartialEpisode.parseURL(data.forum_url, true);
    }
}
exports.AnimePartialEpisode = AnimePartialEpisode;
class AnimeTopic extends base_2.BaseResource {
    constructor(client, data) {
        super(client, data);
        this.title = data.title;
        this.date = new Date(data.date);
        this.authorUsername = data.author_username;
        this.authorURL = AnimeTopic.parseURL(data.author_url);
        this.comments = data.comments;
    }
}
exports.AnimeTopic = AnimeTopic;
class AnimePromo extends base_2.BaseClass {
    constructor(client, data) {
        super(client);
        this.title = data.title;
        this.trailer = new misc_1.YoutubeVideo(client, data.trailer);
    }
}
exports.AnimePromo = AnimePromo;
class AnimeEpisodeVideo extends base_2.BaseResource {
    constructor(client, data) {
        var _a;
        super(client, data);
        this.title = data.title;
        this.episode = typeof (data.episode) === 'string' ? Number((_a = data.episode.toLowerCase().split('episode')[1]) === null || _a === void 0 ? void 0 : _a.trim()) || 0 : 0;
        this.image = data.images != null ? new misc_1.ImageFormatCollection(client, data.images) : null;
    }
}
exports.AnimeEpisodeVideo = AnimeEpisodeVideo;
class AnimeMusicVideo extends base_2.BaseClass {
    constructor(client, data) {
        super(client);
        this.title = data.title;
        this.video = new misc_1.YoutubeVideo(client, data.video);
        this.meta = data.meta;
    }
}
exports.AnimeMusicVideo = AnimeMusicVideo;
class AnimeVideo extends base_2.BaseClass {
    constructor(client, data) {
        var _a, _b, _c;
        super(client);
        this.promos = ((_a = data.promo) === null || _a === void 0 ? void 0 : _a.map((promo) => new AnimePromo(this.client, promo))) || [];
        this.episodes = ((_b = data.episodes) === null || _b === void 0 ? void 0 : _b.map((episodeVideo) => new AnimeEpisodeVideo(this.client, episodeVideo))) || [];
        this.musicVideos = ((_c = data.music_videos) === null || _c === void 0 ? void 0 : _c.map((musicVideo) => new AnimeMusicVideo(client, musicVideo))) || [];
    }
}
exports.AnimeVideo = AnimeVideo;
class AnimeStatistics extends base_1.ContentStatistics {
    constructor(client, data) {
        super(client, data);
        this.watching = data.watching;
        this.planToWatch = data.plan_to_watch;
    }
}
exports.AnimeStatistics = AnimeStatistics;
class AnimeRecommendation extends base_2.BaseClass {
    constructor(client, data) {
        super(client);
        this.entry = new meta_1.AnimeMeta(client, data.entry);
        this.URL = AnimeRecommendation.parseURL(data.url);
        this.votes = data.votes;
    }
}
exports.AnimeRecommendation = AnimeRecommendation;
class AnimeUserUpdate extends base_1.ContentUserUpdate {
    constructor(client, data) {
        super(client, data);
        this.episodesSeen = data.episodes_seen;
        this.episodesTotal = data.episodes_total;
    }
}
exports.AnimeUserUpdate = AnimeUserUpdate;
class AnimeReview extends base_1.ContentReview {
    constructor(client, data) {
        super(client, data);
        this.episodesWatched = data.episodes_watched || 0;
    }
}
exports.AnimeReview = AnimeReview;
class AnimeRelationGroup extends base_1.ContentRelationGroup {
    constructor(client, relation, data) {
        var _a;
        super(client, relation);
        this.items = ((_a = data.entry) === null || _a === void 0 ? void 0 : _a.map((item) => new (this.relation === 'Adaptation' ? meta_1.MangaMeta : meta_1.AnimeMeta)(this.client, item))) || [];
    }
}
exports.AnimeRelationGroup = AnimeRelationGroup;
class AnimeFull extends Anime {
    constructor(client, data) {
        var _a, _b;
        super(client, data);
        this.relations = ((_a = data.relations) === null || _a === void 0 ? void 0 : _a.map((relation) => new AnimeRelationGroup(this.client, AnimeRelationGroup.parseRelation(relation.relation), relation))) || [];
        this.themeSongs = data.theme || data.theme_songs || [];
        this.external = (_b = data.external) === null || _b === void 0 ? void 0 : _b.map((external) => new base_1.ContentExternal(client, external));
        this.streamingLinks = data.streaming;
    }
}
exports.AnimeFull = AnimeFull;
