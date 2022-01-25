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
exports.PlatformRuntime = void 0;
class PlatformRuntime {
    constructor(meroxaJS, imageName) {
        this.registeredFunctions = {};
        this.client = meroxaJS;
        this.imageName = imageName;
    }
    resources(resourceName) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = yield this.client.resources.get(resourceName);
            return new PlatformResource(resource, this.client);
        });
    }
    process(records, fn) {
        return __awaiter(this, void 0, void 0, function* () {
            this.registeredFunctions[fn.name] = fn;
            const functionInput = {
                input_stream: records.stream,
                command: ["node"],
                args: ["index.js", fn.name],
                image: this.imageName,
                pipeline: {
                    name: "default",
                },
                env_vars: {},
            };
            console.log(`deploying function: ${fn.name}`);
            console.log(functionInput);
            try {
                const createdFunction = yield this.client.functions.create(functionInput);
                records.stream = createdFunction.output_stream;
                return records;
            }
            catch (error) {
                if (error.response) {
                    console.log(error.response.data);
                }
                throw error;
            }
        });
    }
}
exports.PlatformRuntime = PlatformRuntime;
class PlatformResource {
    constructor(resource, client) {
        this.resource = resource;
        this.client = client;
    }
    records(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`creating source connector from resource ${this.resource.name}...`);
            const connectorConfig = {
                // Hardcode hack this will only work for pg resources with default schema
                input: `public.${collection}`,
            };
            const connectorInput = {
                // Yep you guessed it, another hardcode hack
                name: "a-source",
                config: connectorConfig,
                metadata: {
                    "mx:connectorType": "source",
                },
                resource_id: this.resource.id,
                pipeline_name: "default",
                pipeline_id: null,
            };
            let connectorResponse;
            try {
                connectorResponse = yield this.client.connectors.create(connectorInput);
            }
            catch (error) {
                if (error.response) {
                    console.log(error.response);
                }
                throw error;
            }
            if (typeof connectorResponse.streams.output === "object") {
                return {
                    stream: connectorResponse.streams.output[0],
                    records: [],
                };
            }
            else {
                throw new Error("no output stream in response");
            }
        });
    }
    write(records, collection) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`creating destination connector from stream ${records.stream}...`);
            const connectorConfig = {
                input: records.stream,
            };
            const connectorInput = {
                name: "a-destination",
                config: connectorConfig,
                metadata: {
                    "mx:connectorType": "destination",
                },
                resource_id: this.resource.id,
                pipeline_name: "default",
                pipeline_id: null,
            };
            yield this.client.connectors.create(connectorInput);
        });
    }
}
