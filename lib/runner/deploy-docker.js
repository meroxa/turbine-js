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
const dockerode_1 = __importDefault(require("dockerode"));
const path_1 = __importDefault(require("path"));
const tar_fs_1 = __importDefault(require("tar-fs"));
const os_1 = __importDefault(require("os"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const ts_results_1 = require("ts-results");
const errors_1 = require("../errors");
function default_1(pathToDataApp) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.DOCKER_HUB_USERNAME ||
            !process.env.DOCKER_HUB_ACCESS_TOKEN) {
            return (0, ts_results_1.Err)(new errors_1.BaseError("Missing DOCKER_HUB_USERNAME or DOCKER_HUB_ACCESS_TOKEN"));
        }
        const tmpDir = path_1.default.join(os_1.default.tmpdir(), "turbine");
        const deployDir = path_1.default.join(__dirname, "../function-deploy");
        const appName = require(path_1.default.resolve(`${pathToDataApp}/app.json`)).name;
        try {
            yield fs_extra_1.default.copy(deployDir, tmpDir);
            yield fs_extra_1.default.copy(pathToDataApp, path_1.default.join(tmpDir, "data-app"));
        }
        catch (e) {
            yield cleanupTmpDir(tmpDir);
            return (0, ts_results_1.Err)(new errors_1.BaseError("Build directory error"));
        }
        const docker = new dockerode_1.default();
        const tarpack = tar_fs_1.default.pack(tmpDir);
        const tagName = `${process.env.DOCKER_HUB_USERNAME}/${appName}`;
        let stream;
        try {
            stream = yield docker.buildImage(tarpack, {
                t: tagName,
            });
            stream.pipe(process.stdout);
            yield new Promise((resolve, reject) => {
                docker.modem.followProgress(stream, (err, res) => err ? reject(err) : resolve(res));
            });
        }
        catch (e) {
            yield cleanupTmpDir(tmpDir);
            (0, errors_1.assertIsError)(e);
            return (0, ts_results_1.Err)(new errors_1.BaseError("docker build error", e));
        }
        const image = docker.getImage(tagName);
        const push = yield image.push({
            tag: "latest",
            authconfig: {
                username: process.env.DOCKER_HUB_USERNAME,
                password: process.env.DOCKER_HUB_ACCESS_TOKEN,
                serveraddress: "https://index.docker.io/v1/",
            },
        });
        push.pipe(process.stdout);
        yield new Promise((resolve, reject) => {
            docker.modem.followProgress(push, (err, res) => err ? reject(err) : resolve(res));
        });
        yield cleanupTmpDir(tmpDir);
        return (0, ts_results_1.Ok)(true);
    });
}
exports.default = default_1;
function cleanupTmpDir(tmpDir) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fs_extra_1.default.remove(tmpDir);
    });
}
//# sourceMappingURL=deploy-docker.js.map