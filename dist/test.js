"use strict";
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
        user: () => __awaiter(void 0, void 0, void 0, function* () { var _m; return (_m = (yield client.users.get('starfishx'))) === null || _m === void 0 ? void 0 : _m.image; })
    };
    return yield func[process.argv[2]]();
});
void run().then((data) => { if (data != null) {
    console.log(data);
} });
