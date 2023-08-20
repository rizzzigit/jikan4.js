"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaMeta = exports.AnimeMeta = exports.CharacterMeta = exports.PersonMeta = exports.MangaGenreMeta = exports.AnimeGenreMeta = exports.ClubMeta = exports.ProducerMeta = exports.MagazineMeta = exports.ContentMeta = exports.Meta = void 0;
const base_1 = require("./base");
const misc_1 = require("./misc");
class Meta extends base_1.BaseResource {
    constructor(client, data, type) {
        super(client, data);
        this.type = type;
        this.name = data.name;
    }
}
exports.Meta = Meta;
class ContentMeta extends base_1.BaseResource {
    constructor(client, data, type) {
        super(client, data);
        this.type = type;
        this.title = data.name || data.title;
        this.image = new misc_1.ImageFormatCollection(client, data.images);
    }
}
exports.ContentMeta = ContentMeta;
class MagazineMeta extends Meta {
    constructor(client, data) {
        super(client, data, 'Magazine');
    }
}
exports.MagazineMeta = MagazineMeta;
class ProducerMeta extends Meta {
    constructor(client, data) {
        super(client, data, 'Producer');
    }
}
exports.ProducerMeta = ProducerMeta;
class ClubMeta extends Meta {
    constructor(client, data) {
        super(client, data, 'Club');
    }
}
exports.ClubMeta = ClubMeta;
class AnimeGenreMeta extends Meta {
    constructor(client, data, type) {
        super(client, data, 'AnimeGenre');
        this.genreType = type;
    }
}
exports.AnimeGenreMeta = AnimeGenreMeta;
class MangaGenreMeta extends Meta {
    constructor(client, data, type) {
        super(client, data, 'MangaGenre');
        this.genreType = type;
    }
}
exports.MangaGenreMeta = MangaGenreMeta;
class PersonMeta extends Meta {
    getFull() {
        return this.client.people.get(this.id);
    }
    constructor(client, data) {
        super(client, data, 'Person');
    }
}
exports.PersonMeta = PersonMeta;
class CharacterMeta extends Meta {
    getFull() {
        return this.client.characters.get(this.id);
    }
    constructor(client, data) {
        super(client, data, 'Character');
    }
}
exports.CharacterMeta = CharacterMeta;
class AnimeMeta extends ContentMeta {
    getFull() {
        return this.client.anime.get(this.id);
    }
    constructor(client, data) {
        super(client, data, 'Anime');
    }
}
exports.AnimeMeta = AnimeMeta;
class MangaMeta extends ContentMeta {
    getFull() {
        return this.client.manga.get(this.id);
    }
    constructor(client, data) {
        super(client, data, 'Manga');
    }
}
exports.MangaMeta = MangaMeta;
