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
const tests = {
    test: (client) => __awaiter(void 0, void 0, void 0, function* () {
        const a = yield client.seasons.get('Spring', 2024, {
            continuing: true
        });
        const b = yield client.seasons.get('Spring', 2024, {
            continuing: false
        });
        const c = yield client.seasons.get('Spring', 2024);
        const result = [a[0], b[0], c[0]];
        return result.map((anime) => `${anime.title}`);
    }),
};
const client = new v4_1.Client();
client.on("debug", (scope, message) => console.log(`[${scope}] ${message}`));
void (() => __awaiter(void 0, void 0, void 0, function* () { return tests[process.argv[2]](client); }))().then((data) => {
    if (data != null) {
        console.log(data);
    }
});
