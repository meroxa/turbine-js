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
exports.generate = void 0;
const { copy, writeJson } = require("fs-extra");
var path = require("path");
function generate(name) {
    return __awaiter(this, void 0, void 0, function* () {
        let appName = name || "my-app";
        let templatesDir = path.resolve(__dirname, "../templates");
        console.log(`Generating Data app ${appName}...`);
        try {
            yield copy(`${templatesDir}/javascript`, appName, {
                errorOnExist: true,
                overwrite: false,
            });
            yield generateAppJson(appName);
            console.log("Success!");
        }
        catch (err) {
            console.error(err);
        }
    });
}
exports.generate = generate;
function generateAppJson(appName) {
    return __awaiter(this, void 0, void 0, function* () {
        let appJson = {
            name: appName,
            language: "javascript",
        };
        console.log("Generating app.json...");
        try {
            yield writeJson(`${appName}/app.json`, appJson);
        }
        catch (err) {
            console.error(err);
        }
    });
}
//# sourceMappingURL=utils.js.map