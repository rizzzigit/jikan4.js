"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonFull = exports.Person = void 0;
const base_1 = require("./base");
const meta_1 = require("./meta");
class Person extends base_1.BaseResource {
    /** @hidden */
    static parseName(data) {
        var _a, _b, _c, _d;
        return {
            name: data.name,
            given: (_a = data.given_name) !== null && _a !== void 0 ? _a : null,
            family: (_b = data.faimly_name) !== null && _b !== void 0 ? _b : null,
            alternate: (_d = (_c = data.alternate_names) === null || _c === void 0 ? void 0 : _c.map((alternate) => alternate !== null && alternate !== void 0 ? alternate : null).filter((alternate) => !!alternate)) !== null && _d !== void 0 ? _d : [],
            toString: () => data.name
        };
    }
    /** @hidden */
    static parseAnimeReference(client, data) {
        return {
            position: data.position,
            anime: new meta_1.AnimeMeta(client, data.anime)
        };
    }
    /** @hidden */
    static parseVoiceActorReference(client, data) {
        return {
            role: data.role,
            anime: new meta_1.AnimeMeta(client, data.anime),
            character: new meta_1.CharacterMeta(client, data.character)
        };
    }
    /** @hidden */
    static parseMangaReference(client, data) {
        return {
            position: data.position,
            manga: new meta_1.MangaMeta(client, data.manga)
        };
    }
    getAnime() {
        return this.client.people.getAnime(this.id);
    }
    getVoiceActors() {
        return this.client.people.getVoiceActors(this.id);
    }
    getManga() {
        return this.client.people.getManga(this.id);
    }
    getPictures() {
        return this.client.people.getPictures(this.id);
    }
    getFull() {
        return this.client.people.getFull(this.id);
    }
    constructor(client, data) {
        var _a;
        super(client, data);
        this.websiteUrl = Person.parseURL(data.website_url, true);
        this.image = Person.parseImage((_a = data.images) === null || _a === void 0 ? void 0 : _a.jpg);
        this.name = Person.parseName(data);
        this.birth = Person.parseDate(data.birthday, true);
        this.favorites = data.favorites;
        this.about = data.about || null;
    }
}
exports.Person = Person;
class PersonFull extends Person {
    constructor(client, data) {
        var _a, _b, _c;
        super(client, data);
        this.anime = ((_a = data.anime) === null || _a === void 0 ? void 0 : _a.map((anime) => Person.parseAnimeReference(client, anime))) || [];
        this.manga = ((_b = data.manga) === null || _b === void 0 ? void 0 : _b.map((manga) => Person.parseMangaReference(client, manga))) || [];
        this.voices = ((_c = data.voices) === null || _c === void 0 ? void 0 : _c.map((voice) => Person.parseVoiceActorReference(client, voice))) || [];
    }
}
exports.PersonFull = PersonFull;
