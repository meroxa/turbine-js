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
const { copy } = require("fs-extra");
const path = require("path");
const runtime_1 = require("../runtime");
exports.run = (nodeEnv, buildEnv, pathToDataApp) => __awaiter(void 0, void 0, void 0, function* () {
    const { App } = require(path.resolve(pathToDataApp));
    const app = new App();
    const appJSON = require(path.resolve(`${pathToDataApp}/app.json`));
    let environment;
    if (nodeEnv != "production") {
        environment = new runtime_1.LocalRuntime(appJSON, pathToDataApp);
        return app.run(environment);
    }
    const meroxaJS = new runtime_1.Client({
        auth: process.env.MEROXA_ACCESS_TOKEN || "",
        url: process.env.MEROXA_API_URL,
    });
    if (buildEnv === "docker-github") {
        const { triggerWorkflowRun, waitForWorkflowRun, } = require("./deploy-docker-github");
        console.log("Triggering meroxa deploy github action from latest commit on default branch...");
        const runID = yield triggerWorkflowRun();
        console.log("GitHub action in progress, building image...");
        const sha = yield waitForWorkflowRun(runID);
        console.log(`Docker image ${process.env.DOCKER_HUB_USERNAME}/${sha} built and pushed successfully.`);
        environment = new runtime_1.PlatformRuntime(meroxaJS, `${process.env.DOCKER_HUB_USERNAME}/${sha}`, appJSON);
    }
    else if (buildEnv === "docker-local") {
        const build = require("./deploy-docker");
        yield build(pathToDataApp);
        environment = new runtime_1.PlatformRuntime(meroxaJS, `${process.env.DOCKER_HUB_USERNAME}/${appJSON.name}`, appJSON);
    }
    else {
        throw new Error("Unknown build environment");
    }
    console.log("Running data app...");
    return app.run(environment);
});
exports.generate = (name) => {
    let appName = name || "my-app";
    console.log(`Generating data app ${appName}...`);
    return copy("templates/javascript", appName, { overwrite: false, errorOnExist: true }, (err) => {
        if (err)
            return console.error(err);
        console.log("success!");
    });
};
//# sourceMappingURL=index.js.map