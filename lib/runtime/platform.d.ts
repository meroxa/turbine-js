import { Resource, Record, Records, Runtime, RegisteredFunctions } from "./types";
import { Client } from "meroxa-js";
export declare class PlatformRuntime implements Runtime {
    registeredFunctions: RegisteredFunctions;
    client: Client;
    imageName: string;
    constructor(meroxaJS: Client, imageName: string);
    resources(resourceName: string): Promise<Resource>;
    process(records: Records, fn: (rr: Record[]) => Record[]): Promise<Records>;
}