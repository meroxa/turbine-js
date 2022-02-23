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
const errors_1 = require("../errors");
class PlatformRuntime {
    constructor(meroxaJS, imageName, appConfig) {
        this.registeredFunctions = {};
        this.client = meroxaJS;
        this.imageName = imageName;
        this.appConfig = appConfig;
    }
    resources(resourceName) {
        return __awaiter(this, void 0, void 0, function* () {
            let resource;
            try {
                resource = yield this.client.resources.get(resourceName);
            }
            catch (e) {
                if (e.response) {
                    throw new errors_1.APIError(e);
                }
                if (e.request) {
                    throw new errors_1.BaseError("no server response");
                }
                throw e;
            }
            return new PlatformResource(resource, this.client, this.appConfig);
        });
    }
    process(records, fn, envVars) {
        return __awaiter(this, void 0, void 0, function* () {
            const functionInput = {
                input_stream: records.stream,
                command: ["node"],
                args: ["index.js", fn.name],
                image: this.imageName,
                pipeline: {
                    name: this.appConfig.name,
                },
                env_vars: envVars,
            };
            console.log(`deploying function: ${fn.name}`);
            try {
                const createdFunction = yield this.client.functions.create(functionInput);
                records.stream = createdFunction.output_stream;
                return records;
            }
            catch (e) {
                if (e.response) {
                    throw new errors_1.APIError(e);
                }
                if (e.request) {
                    throw new errors_1.BaseError("no server response");
                }
                throw e;
            }
        });
    }
}
exports.PlatformRuntime = PlatformRuntime;
class PlatformResource {
    constructor(resource, client, appConfig) {
        this.resource = resource;
        this.client = client;
        this.appConfig = appConfig;
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
                pipeline_name: this.appConfig.name,
                pipeline_id: null,
            };
            let connectorResponse;
            try {
                connectorResponse = yield this.client.connectors.create(connectorInput);
            }
            catch (e) {
                if (e.response) {
                    throw new errors_1.APIError(e);
                }
                if (e.request) {
                    throw new errors_1.BaseError("no server response");
                }
                throw e;
            }
            if (typeof connectorResponse.streams.output === "object") {
                return {
                    stream: connectorResponse.streams.output[0],
                    records: [],
                };
            }
            else {
                throw new errors_1.BaseError("no output stream in response");
            }
        });
    }
    write(records, collection) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`creating destination connector from stream ${records.stream}...`);
            const connectorConfig = {
                input: records.stream,
            };
            switch (this.resource.type) {
                case "redshift":
                case "postgres":
                case "mysql":
                    break;
                case "s3":
                    connectorConfig["aws_s3_prefix"] = `${collection.toLowerCase()}/`;
                    connectorConfig["value.converter"] =
                        "org.apache.kafka.connect.json.JsonConverter";
                    connectorConfig["value.converter.schemas.enable"] = "true";
                    connectorConfig["format.output.type"] = "jsonl";
                    connectorConfig["format.output.envelope"] = "true";
                    break;
            }
            const connectorInput = {
                name: "a-destination",
                config: connectorConfig,
                metadata: {
                    "mx:connectorType": "destination",
                },
                resource_id: this.resource.id,
                pipeline_name: this.appConfig.name,
                pipeline_id: null,
            };
            try {
                yield this.client.connectors.create(connectorInput);
            }
            catch (e) {
                if (e.response) {
                    throw new errors_1.APIError(e);
                }
                if (e.request) {
                    throw new errors_1.BaseError("no server response");
                }
                throw e;
            }
        });
    }
}
//# sourceMappingURL=platform.js.map