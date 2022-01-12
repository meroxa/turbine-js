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
exports.LocalRuntime = void 0;
const promises_1 = require("fs/promises");
class LocalRuntime {
    constructor(fixturesPath) {
        this.fixturesPath = fixturesPath;
    }
    resources(resourceName) {
        const resourceFixturesPath = `${this.fixturesPath}/${resourceName}.json`;
        return new LocalResource(resourceName, resourceFixturesPath);
    }
    process(records, fn) {
        let processedRecords = fn(records.records);
        return {
            records: processedRecords,
            stream: "",
        };
    }
}
exports.LocalRuntime = LocalRuntime;
class LocalResource {
    constructor(name, fixturesPath) {
        this.name = name;
        this.fixturesPath = fixturesPath;
    }
    records(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            return readFixtures(this.fixturesPath, collection, this.name);
        });
    }
    write(records, collection) {
        console.log(`=====================to ${this.name} resource=====================`);
        records.records.forEach((record) => {
            console.log({ record });
        });
    }
}
function readFixtures(path, collection, resourceName) {
    return __awaiter(this, void 0, void 0, function* () {
        const rawFixtures = yield (0, promises_1.readFile)(path);
        let fixtures = JSON.parse(rawFixtures.toString());
        let collectionFixtures = fixtures[collection];
        let collectionKeys = Object.keys(collectionFixtures);
        let records = collectionKeys.map((key) => {
            return {
                key,
                payload: collectionFixtures[key],
                timestamp: Date.now(),
            };
        });
        console.log(`=====================from ${resourceName} resource=====================`);
        records.forEach((record) => {
            console.log({ record });
        });
        return {
            records,
            stream: "",
        };
    });
}
