import { Resource, Record, Records, Runtime, RegisteredFunctions, AppConfig } from "./types";
import { Client } from "meroxa-js";
export declare class PlatformRuntime implements Runtime {
    registeredFunctions: RegisteredFunctions;
    client: Client;
    imageName: string;
    appConfig: AppConfig;
    constructor(meroxaJS: Client, imageName: string, appConfig: AppConfig);
    resources(resourceName: string): Promise<Resource>;
    process(records: Records, fn: (rr: Record[]) => Record[], envVars: {
        [index: string]: string;
    }): Promise<Records>;
}
