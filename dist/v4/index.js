"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./core/api"), exports);
__exportStar(require("./core/client"), exports);
__exportStar(require("./core/heartbeat"), exports);
__exportStar(require("./core/cache"), exports);
__exportStar(require("./manager/base"), exports);
__exportStar(require("./manager/anime"), exports);
__exportStar(require("./manager/manga"), exports);
__exportStar(require("./manager/character"), exports);
__exportStar(require("./manager/club"), exports);
__exportStar(require("./manager/person"), exports);
__exportStar(require("./manager/manga"), exports);
__exportStar(require("./manager/genre"), exports);
__exportStar(require("./manager/magazine"), exports);
__exportStar(require("./manager/producer"), exports);
__exportStar(require("./manager/season"), exports);
__exportStar(require("./manager/top"), exports);
__exportStar(require("./manager/schedule"), exports);
__exportStar(require("./manager/user"), exports);
__exportStar(require("./resource/base"), exports);
__exportStar(require("./resource/character"), exports);
__exportStar(require("./resource/club"), exports);
__exportStar(require("./resource/content/base"), exports);
__exportStar(require("./resource/content/anime"), exports);
__exportStar(require("./resource/content/manga"), exports);
__exportStar(require("./resource/meta"), exports);
__exportStar(require("./resource/misc"), exports);
__exportStar(require("./resource/person"), exports);
__exportStar(require("./resource/season"), exports);
__exportStar(require("./resource/top"), exports);
__exportStar(require("./resource/user"), exports);
__exportStar(require("./resource/producer"), exports);
__exportStar(require("./utils"), exports);
