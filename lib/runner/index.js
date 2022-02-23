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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = exports.run = void 0;
const fs_extra_1 = require("fs-extra");
const path_1 = __importDefault(require("path"));
const runtime_1 = require("../runtime");
const deploy_docker_1 = __importDefault(require("./deploy-docker"));
const errors_1 = require("../errors");
const ts_results_1 = require("ts-results");
function run(nodeEnv, buildEnv, pathToDataApp) {
    return __awaiter(this, void 0, void 0, function* () {
        const { App } = require(path_1.default.resolve(pathToDataApp));
        const app = new App();
        const appJSON = require(path_1.default.resolve(`${pathToDataApp}/app.json`));
        let environment;
        if (nodeEnv != "production") {
            environment = new runtime_1.LocalRuntime(appJSON, pathToDataApp);
            yield app.run(environment);
            return (0, ts_results_1.Ok)(true);
        }
        const meroxaJS = new runtime_1.Client({
            auth: process.env.MEROXA_ACCESS_TOKEN || "",
            url: process.env.MEROXA_API_URL,
        });
        if (buildEnv === "docker-local") {
            const build = yield (0, deploy_docker_1.default)(pathToDataApp);
            if (build.err) {
                return (0, ts_results_1.Err)(new errors_1.BaseError("Error running local docker build", build.val));
            }
            environment = new runtime_1.PlatformRuntime(meroxaJS, `${process.env.DOCKER_HUB_USERNAME}/${appJSON.name}`, appJSON);
        }
        else {
            return (0, ts_results_1.Err)(new errors_1.BaseError("Unknown build environment"));
        }
        console.log("Running data app...");
        try {
            yield app.run(environment);
            return (0, ts_results_1.Ok)(true);
        }
        catch (e) {
            (0, errors_1.assertIsError)(e);
            return (0, ts_results_1.Err)(new errors_1.BaseError("Error running app", e));
        }
    });
}
exports.run = run;
function generate(name) {
    return __awaiter(this, void 0, void 0, function* () {
        let appName = name || "my-app";
        console.log(`Generating data app ${appName}...`);
        try {
            yield (0, fs_extra_1.copy)("templates/javascript", appName, {
                overwrite: false,
                errorOnExist: true,
            });
            console.log("App generated successfully");
            return (0, ts_results_1.Ok)(true);
        }
        catch (e) {
            (0, errors_1.assertIsError)(e);
            return (0, ts_results_1.Err)(new errors_1.BaseError("Error generating app", e));
        }
    });
}
exports.generate = generate;
//# sourceMappingURL=index.js.map