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
    constructor(meroxaJS, imageName, appConfig) {
        this.registeredFunctions = {};
        this.client = meroxaJS;
        this.imageName = imageName;
        this.appConfig = appConfig;
    }
    resources(resourceName) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = yield this.client.resources.get(resourceName);
            return new PlatformResource(resource, this.client, this.appConfig);
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
                    name: this.appConfig.pipeline,
                },
                // TODO register secrets
                env_vars: {},
            };
            console.log(`deploying function: ${fn.name}`);
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
            // TODO JDBC Source support
            // switch (this.resource.type) {
            //   case "redshift":
            //   case "postgres":
            //   case "mysql":
            //     connectorConfig["transforms"] = "createKey,extractInt";
            //     connectorConfig["transforms.createKey.fields"] = "id";
            //     connectorConfig["transforms.createKey.type"] =
            //       "org.apache.kafka.connect.transforms.ValueToKey";
            //     connectorConfig["transforms.extractInt.field"] = "id";
            //     connectorConfig["transforms.extractInt.type"] =
            //       "org.apache.kafka.connect.transforms.ExtractField$Key";
            // }
            const connectorInput = {
                // Yep you guessed it, another hardcode hack
                name: "a-source",
                config: connectorConfig,
                metadata: {
                    "mx:connectorType": "source",
                },
                resource_id: this.resource.id,
                pipeline_name: this.appConfig.pipeline,
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
            switch (this.resource.type) {
                case "redshift":
                case "postgres":
                case "mysql":
                    // TODO JDBC Sink Config
                    // connectorConfig["table.name.format"] = collection.toLowerCase();
                    // connectorConfig["pk.mode"] = "record_value";
                    // connectorConfig["pk.fields"] = "id";
                    // this.resource.type != "redshift"
                    //   ? (connectorConfig["insert.mode"] = "upsert")
                    //   : null;
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
                pipeline_name: "default",
                pipeline_id: null,
            };
            yield this.client.connectors.create(connectorInput);
        });
    }
}
