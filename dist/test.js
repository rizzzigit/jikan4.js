"use strict";
/*
  eslint-disable @typescript-eslint/no-non-null-assertion
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const v4_1 = require("./v4");
const client = new v4_1.Client();
client.on('debug', (scope, message) => { console.log(`[${scope}] ${message}`); });
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    const f = ['webp', 'jpg'];
    const s = ['maximum', 'large', 'medium', 'default', 'small'];
    const func = {
        userFull: () => __awaiter(void 0, void 0, void 0, function* () {
            console.log(yield client.users.getFull('starfishx'));
            console.log(yield client.users.getExternal('starfishx'));
        }),
        pictures: () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            return {
                character: (_a = (yield client.characters.getPictures(11))) === null || _a === void 0 ? void 0 : _a.map((e) => e.getOrFallback(f, s)),
                anime: (_b = (yield client.anime.getPictures(5))) === null || _b === void 0 ? void 0 : _b.map((e) => e.getOrFallback(f, s)),
                manga: (_c = (yield client.manga.getPictures(4))) === null || _c === void 0 ? void 0 : _c.map((e) => e.getOrFallback(f, s)),
                person: (_e = (_d = (yield client.people.get(1))) === null || _d === void 0 ? void 0 : _d.image) === null || _e === void 0 ? void 0 : _e.getOrFallback(f, s)
            };
        }),
        anime: () => __awaiter(void 0, void 0, void 0, function* () { var _f; return (_f = (yield client.anime.get(5))) === null || _f === void 0 ? void 0 : _f.image; }),
        manga: () => __awaiter(void 0, void 0, void 0, function* () { var _g; return (_g = (yield client.manga.get(4))) === null || _g === void 0 ? void 0 : _g.image; }),
        character: () => __awaiter(void 0, void 0, void 0, function* () { var _h; return (_h = (yield client.characters.get(5))) === null || _h === void 0 ? void 0 : _h.image; }),
        person: () => __awaiter(void 0, void 0, void 0, function* () { var _j; return (_j = (yield client.people.get(5))) === null || _j === void 0 ? void 0 : _j.image; }),
        club: () => __awaiter(void 0, void 0, void 0, function* () { var _k; return (_k = (yield client.clubs.get(5))) === null || _k === void 0 ? void 0 : _k.image; }),
        producer: () => __awaiter(void 0, void 0, void 0, function* () { var _l; return (_l = (yield client.producers.get(5))) === null || _l === void 0 ? void 0 : _l.image; }),
        user: () => __awaiter(void 0, void 0, void 0, function* () { var _m; return (_m = (yield client.users.get('starfishx'))) === null || _m === void 0 ? void 0 : _m.image; }),
        metaImages: () => __awaiter(void 0, void 0, void 0, function* () {
            let nulls = 0;
            const getUrl = (meta) => {
                var _a, _b, _c;
                return (_c = (_b = (_a = meta.image) === null || _a === void 0 ? void 0 : _a.getOrFallback(f, s)) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : `null ${++nulls}`;
            };
            for (const anime of yield client.anime.list(0, 50)) {
                console.log('ANIME');
                for (const character of yield anime.getCharacters()) {
                    console.log(`character ${character.character.name}: ${getUrl(character.character)}`);
                    for (const person of character.voiceActors) {
                        console.log(` voiceActor ${person.person.name}: ${getUrl(person.person)}`);
                    }
                }
                for (const person of yield anime.getStaff()) {
                    console.log(`person ${person.person.name}: ${getUrl(person.person)}`);
                }
                // for (const producer of [...anime.producers, ...anime.licensors, ...anime.studios]) {
                //   console.log(`producer ${producer.name}: ${getUrl(producer)}`)
                // }
            }
            for (const manga of yield client.manga.list(0, 50)) {
                console.log('MANGA');
                for (const character of yield manga.getCharacters()) {
                    console.log(`character ${character.character.name}: ${getUrl(character.character)}`);
                }
            }
            for (const person of yield client.people.list(0, 50)) {
                console.log('PERSON');
                for (const anime of yield person.getAnime()) {
                    console.log(`anime ${anime.anime.title}: ${getUrl(anime.anime)}`);
                }
                for (const voice of yield person.getVoiceActors()) {
                    console.log(` anime ${voice.anime.title}: ${getUrl(voice.anime)}`);
                    console.log(`   character ${voice.character.name}: ${getUrl(voice.character)}`);
                }
                for (const manga of yield person.getManga()) {
                    console.log(` manga ${manga.manga.title}: ${getUrl(manga.manga)}`);
                }
            }
            console.log(nulls);
            // Manga.authors[0].images is undefined
        }),
        missingMethods: () => __awaiter(void 0, void 0, void 0, function* () {
            // const manga = await client.manga.get(4)
            // const club = await client.clubs.get(123)
            console.log(yield client.reviews.getAnimeReviews());
        }),
        allAnimeEpisodes: () => __awaiter(void 0, void 0, void 0, function* () {
            var _o;
            const stats = {};
            // const stats: Record<string, { count: number, most: number, avg: number }> = {}
            // const totalEpisodes = 0
            for (const { type, episodes } of yield client.anime.list(0, 0)) {
                const current = (_o = stats[type]) !== null && _o !== void 0 ? _o : (stats[type] = {
                    null: 0,
                    zero: 0,
                    one: 0,
                    '2-10': 0,
                    '11-100': 0,
                    '101-200': 0,
                    more: 0
                });
                if (episodes == null) {
                    current.null++;
                }
                else if (episodes === 0) {
                    current.zero++;
                }
                else if (episodes === 1) {
                    current.one++;
                }
                else if ((episodes >= 2) && (episodes <= 10)) {
                    current['2-10']++;
                }
                else if ((episodes >= 11) && (episodes <= 100)) {
                    current['11-100']++;
                }
                else if ((episodes >= 101) && (episodes <= 200)) {
                    current['101-200']++;
                }
                else if ((episodes > 200)) {
                    current.more++;
                }
                // if (anime.episodes == null) {
                //   continue
                // }
                // const current = stats[anime.type] ??= {
                //   count: 0,
                //   most: anime.episodes,
                //   avg: 0
                // }
                // current.most = Math.max(current.most, anime.episodes)
                // current.avg = (totalEpisodes += anime.episodes) / (++current.count)
            }
            console.log('Anime types with at least one episodes.');
            console.table(stats);
        }),
        nullableImageCollection: () => __awaiter(void 0, void 0, void 0, function* () {
            const log = (image) => {
                console.log(image);
            };
            void (() => __awaiter(void 0, void 0, void 0, function* () {
                for (const anime of yield client.anime.list(0, 0)) {
                    log(anime.image);
                    for (const relation of yield anime.getRelations()) {
                        for (const picture of relation.items) {
                            log(picture.image);
                        }
                    }
                    for (const picture of yield anime.getPictures()) {
                        log(picture);
                    }
                }
            }))();
            void (() => __awaiter(void 0, void 0, void 0, function* () {
                for (const manga of yield client.manga.list(0, 0)) {
                    log(manga.image);
                    for (const picture of yield manga.getPictures()) {
                        log(picture);
                    }
                    for (const relation of yield manga.getRelations()) {
                        for (const picture of relation.items) {
                            log(picture.image);
                        }
                    }
                }
            }))();
            void (() => __awaiter(void 0, void 0, void 0, function* () {
                for (const character of yield client.characters.list(0, 0)) {
                    log(character.image);
                    for (const picture of yield character.getPictures()) {
                        log(picture);
                    }
                    for (const anime of yield character.getAnime()) {
                        log(anime.anime.image);
                    }
                    for (const anime of yield character.getManga()) {
                        log(anime.manga.image);
                    }
                }
            }));
            void (() => __awaiter(void 0, void 0, void 0, function* () {
                for (const person of yield client.people.list(0, 0)) {
                    log(person.image);
                    for (const picture of yield person.getPictures()) {
                        log(picture);
                    }
                    for (const anime of yield person.getAnime()) {
                        log(anime.anime.image);
                    }
                }
            }))();
            // return [
            //   await (await client.anime.get(5))!.getPictures(),
            //   await (await client.anime.get(5))!.getRelations(),
            //   await (await client.characters.get(1))!.getPictures(),
            //   await (await client.manga.get(4))!.getPictures(),
            //   await (await client.people.get(1))!.getPictures(),
            //   [(await client.clubs.get(100))!.image],
            //   [(await client.users.get('starfishx'))!.image]
            // ]
        })
    };
    return yield func[process.argv[2]]();
});
void run().then((data) => { if (data != null) {
    console.log(data);
} });
