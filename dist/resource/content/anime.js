"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimeRelationGroup = exports.AnimeReview = exports.AnimeReviewScores = exports.AnimeUserUpdate = exports.AnimeNews = exports.AnimeRecommendation = exports.AnimeStatistics = exports.AnimeVideo = exports.AnimeEpisodeVideo = exports.AnimePromo = exports.AnimeTopic = exports.AnimePartialEpisode = exports.AnimeEpisode = exports.AnimeEpisodeTitle = exports.AnimeStaffReference = exports.AnimeCharacterReference = exports.AnimeVoiceActorReference = exports.Anime = exports.AnimeAirInformation = void 0;
const tslib_1 = require("tslib");
const base_1 = require("./base");
const base_2 = require("../base");
const misc_1 = require("../misc");
const meta_1 = require("../meta");
const parse_duration_1 = (0, tslib_1.__importDefault)(require("parse-duration"));
const genre_1 = require("../../manager/genre");
class AnimeAirInformation extends base_2.BaseClass {
    constructor(client, data) {
        super(client);
        this.status = AnimeAirInformation.parseStatus(data.status);
        this.airing = !!data.airing;
        this.airedFrom = AnimeAirInformation.parseDate(data.aired.from, true);
        this.airedTo = AnimeAirInformation.parseDate(data.aired.to, true);
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    static parseStatus(input) {
        const status = input === null || input === void 0 ? void 0 : input.toLowerCase().trim();
        switch (status) {
            case 'finished airing': return 'FinishedAiring';
            case 'currently airing': return 'Airing';
            case 'not yet aired': return 'NotYetAired';
            default: return 'Unknown';
        }
    }
}
exports.AnimeAirInformation = AnimeAirInformation;
class Anime extends base_1.Content {
    constructor(client, data) {
        super(client, data);
        this.trailer = Anime.parseTrailer(client, data.trailer);
        this.type = Anime.parseType(data.type);
        this.source = Anime.parseString(data.source, true);
        this.episodes = Anime.parseNumber(data.episodes, true);
        this.airInfo = new AnimeAirInformation(client, data);
        this.duration = Anime.parseNumber((0, parse_duration_1.default)(data.duration, 'millisecond'), true);
        this.rating = Anime.parseRating(data.rating);
        this.season = Anime.parseSeason(data.season);
        this.year = Anime.parseNumber(data.year, true);
        this.producers = data.producers.map((producer) => new meta_1.ProducerMeta(this.client, producer));
        this.licensors = data.licensors.map((licensor) => new meta_1.ProducerMeta(this.client, licensor));
        this.studios = data.studios.map((studio) => new meta_1.ProducerMeta(this.client, studio));
        this.genres = data.genres.map((genre) => new meta_1.AnimeGenreMeta(this.client, genre, 'Genre'));
        this.explicitGenres = data.explicit_genres.map((genre) => new meta_1.AnimeGenreMeta(this.client, genre, 'Explicit'));
        this.demographics = data.demographics.map((genre) => new meta_1.AnimeGenreMeta(this.client, genre, 'Demographic'));
        this.themes = data.themes.map((genre) => new meta_1.AnimeGenreMeta(this.client, genre, 'Theme'));
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    static parseTrailer(client, input) {
        const youtubeID = input === null || input === void 0 ? void 0 : input.youtube_id;
        return youtubeID ? new misc_1.YoutubeVideo(client, youtubeID) : null;
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    static parseType(input) {
        switch (input === null || input === void 0 ? void 0 : input.toLowerCase().trim()) {
            case 'tv': return 'TV';
            case 'ova': return 'OVA';
            case 'movie': return 'Movie';
            case 'special': return 'Special';
            case 'ona': return 'ONA';
            case 'music': return 'Music';
            case 'unknow':
            case 'unknown':
            case '-':
            default: return 'Unknown';
        }
    }
    // eslint-disable-next-line tsdoc/syntax
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
    // eslint-disable-next-line tsdoc/syntax
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
    getEpisode(episodeID) {
        return this.client.anime.getEpisode(this.id, episodeID);
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
}
exports.Anime = Anime;
class AnimeVoiceActorReference extends base_2.BaseClass {
    constructor(client, animeId, data) {
        super(client);
        this.animeId = animeId;
        this.language = AnimeVoiceActorReference.parseString(data);
        this.person = new meta_1.PersonMeta(client, data.person);
    }
    getAnime() {
        return this.client.anime.get(this.animeId);
    }
}
exports.AnimeVoiceActorReference = AnimeVoiceActorReference;
class AnimeCharacterReference extends base_2.BaseClass {
    constructor(client, animeId, data) {
        super(client);
        this.animeId = animeId;
        this.role = AnimeCharacterReference.parseString(data.role);
        this.character = new meta_1.CharacterMeta(client, data.character);
        this.voiceActors = data.voice_actors.map((voiceActor) => new AnimeVoiceActorReference(this.client, this.animeId, voiceActor));
    }
    getAnime() {
        return this.client.anime.get(this.animeId);
    }
}
exports.AnimeCharacterReference = AnimeCharacterReference;
class AnimeStaffReference extends base_2.BaseClass {
    constructor(client, animeId, data) {
        super(client);
        this.animeId = animeId;
        this.positions = data.positions.map((position) => AnimeStaffReference.parseString(position)).filter((position) => !!position);
        this.person = new meta_1.PersonMeta(client, data.person);
    }
    getAnime() {
        return this.client.anime.get(this.animeId);
    }
}
exports.AnimeStaffReference = AnimeStaffReference;
class AnimeEpisodeTitle extends base_2.BaseClass {
    constructor(client, data) {
        super(client);
        this.default = AnimeEpisode.parseString(data.title);
        this.japanese = AnimeEpisode.parseString(data.japanese, true);
        this.romanji = AnimeEpisode.parseString(data.romanji, true);
    }
    toString() {
        return this.default;
    }
}
exports.AnimeEpisodeTitle = AnimeEpisodeTitle;
class AnimeEpisode extends base_2.BaseClass {
    constructor(client, animeId, data) {
        super(client);
        this.animeId = animeId;
        this.episodeId = AnimeEpisode.parseNumber(data.mal_id);
        this.URL = AnimeEpisode.parseURL(data.url, true);
        this.title = new AnimeEpisodeTitle(client, data);
        this.duration = AnimeEpisode.parseNumber(data.duration);
        this.aired = data.aired ? new Date(data.aired) : null;
        this.filler = !!data.filler;
        this.recap = !!data.recap;
        this.synopsis = AnimeEpisode.parseString(data.synopsis, true);
    }
    getAnime() {
        return this.client.anime.get(this.animeId);
    }
}
exports.AnimeEpisode = AnimeEpisode;
class AnimePartialEpisode extends AnimeEpisode {
    constructor(client, animeID, data) {
        super(client, animeID, data);
        this.synopsis = null;
        this.forumUrl = AnimePartialEpisode.parseURL(data.forum_url);
    }
    getFullEpisode() {
        return this.client.anime.getEpisode(this.animeId, this.episodeId);
    }
}
exports.AnimePartialEpisode = AnimePartialEpisode;
class AnimeTopic extends base_2.BaseResource {
    constructor(client, animeId, data) {
        super(client, data);
        this.animeId = animeId;
        this.title = AnimeTopic.parseString(data.title);
        this.date = new Date(data.date);
        this.authorUsername = AnimeTopic.parseString(data.author_username);
        this.authorURL = AnimeTopic.parseURL(data.author_url);
        this.comments = AnimeTopic.parseNumber(data.comments);
    }
    getAnime() {
        return this.client.anime.get(this.id);
    }
}
exports.AnimeTopic = AnimeTopic;
class AnimePromo extends base_2.BaseClass {
    constructor(client, animeId, data) {
        super(client);
        this.animeId = animeId;
        this.title = AnimePromo.parseString(data.title);
        this.trailer = Object.assign(new misc_1.YoutubeVideo(client, data.trailer.youtube_id), { image: new misc_1.Image(client, data.trailer.images) });
    }
    getAnime() {
        return this.client.anime.get(this.animeId);
    }
}
exports.AnimePromo = AnimePromo;
class AnimeEpisodeVideo extends base_2.BaseResource {
    constructor(client, animeId, data) {
        var _a;
        super(client, data);
        this.animeId = animeId;
        this.title = AnimeEpisodeVideo.parseString(data.title);
        this.episode = typeof (data.episode) === 'string' ? Number((_a = data.episode.toLowerCase().split('episode')[1]) === null || _a === void 0 ? void 0 : _a.trim()) || 0 : 0;
        this.imageURL = AnimeEpisodeVideo.parseURL(data.images.image_url);
    }
    getAnime() {
        return this.client.anime.get(this.animeId);
    }
}
exports.AnimeEpisodeVideo = AnimeEpisodeVideo;
class AnimeVideo extends base_2.BaseClass {
    constructor(client, animeId, data) {
        super(client);
        this.animeId = animeId;
        this.promos = data.promo.map((promo) => new AnimePromo(this.client, this.animeId, promo));
        this.episodes = data.episodes.map((episodeVideo) => new AnimeEpisodeVideo(this.client, this.animeId, episodeVideo));
    }
}
exports.AnimeVideo = AnimeVideo;
class AnimeStatistics extends base_1.ContentStatistics {
    constructor(client, animeId, data) {
        super(client, data);
        this.animeId = animeId;
        this.watching = AnimeStatistics.parseNumber(data.watching);
        this.planToWatch = AnimeStatistics.parseNumber(data.plan_to_watch);
    }
    getAnime() {
        return this.client.anime.get(this.animeId);
    }
}
exports.AnimeStatistics = AnimeStatistics;
class AnimeRecommendation extends base_2.BaseClass {
    constructor(client, animeId, data) {
        super(client);
        this.animeId = animeId;
        this.entry = new meta_1.AnimeMeta(client, data.entry);
        this.URL = AnimeRecommendation.parseURL(data.url);
        this.votes = AnimeRecommendation.parseNumber(data.votes);
    }
    getAnime() {
        return this.client.anime.get(this.animeId);
    }
}
exports.AnimeRecommendation = AnimeRecommendation;
class AnimeNews extends base_1.ContentNews {
    constructor(client, animeId, data) {
        super(client, data);
        this.animeID = animeId;
    }
    getAnime() {
        return this.client.anime.get(this.animeID);
    }
}
exports.AnimeNews = AnimeNews;
class AnimeUserUpdate extends base_1.ContentUserUpdate {
    constructor(client, animeId, data) {
        super(client, data);
        this.animeId = animeId;
        this.episodesSeen = AnimeUserUpdate.parseNumber(data.episodes_seen);
        this.episodesTotal = AnimeUserUpdate.parseNumber(data.episodes_total);
    }
    getAnime() {
        return this.client.anime.get(this.animeId);
    }
}
exports.AnimeUserUpdate = AnimeUserUpdate;
class AnimeReviewScores extends base_1.ContentReviewScores {
    constructor(client, data) {
        super(client, data);
        this.animation = AnimeReviewScores.parseNumber(data.animation);
        this.sound = AnimeReviewScores.parseNumber(data.sound);
    }
}
exports.AnimeReviewScores = AnimeReviewScores;
class AnimeReview extends base_1.ContentReview {
    constructor(client, animeId, data) {
        super(client, data);
        this.animeId = animeId;
        this.episodesWatched = AnimeReview.parseNumber(data.episodes_watched);
        this.scores = new AnimeReviewScores(client, data.scores);
    }
    getAnime() {
        return this.client.anime.get(this.animeId);
    }
}
exports.AnimeReview = AnimeReview;
class AnimeRelationGroup extends base_1.ContentRelationGroup {
    constructor(client, animeId, relation, data) {
        super(client, relation, data);
        this.animeId = animeId;
        this.items = data.map((item) => new (this.relation === 'Adaptation' ? meta_1.MangaMeta : meta_1.AnimeMeta)(this.client, item));
    }
    getAnime() {
        return this.client.anime.get(this.animeId);
    }
}
exports.AnimeRelationGroup = AnimeRelationGroup;
