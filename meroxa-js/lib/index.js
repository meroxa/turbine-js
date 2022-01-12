"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeroxaJS = void 0;
const axios_1 = __importDefault(require("axios"));
__exportStar(require("./types"), exports);
class MeroxaJS {
    constructor() {
        this.apiVersion = "v1";
        let v = this.apiVersion;
        this.client = axios_1.default.create({
            baseURL: `https://api.meroxa.io/${v}`,
            timeout: 10000,
            headers: { Authorization: `Bearer ${process.env.AUTH_TOKEN}` },
        });
    }
    getResource(nameOrID) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.client.get(`/resources/${nameOrID}`);
            return response.data;
        });
    }
    createConnector(connector) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.client.post("/connectors", connector);
            return response.data;
        });
    }
}
exports.MeroxaJS = MeroxaJS;
