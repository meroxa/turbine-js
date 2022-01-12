import { Resource, Record, Records, Runtime, RegisteredFunctions } from "../types";
import type { MeroxaJS } from "meroxa-js";
export declare class PlatformRuntime implements Runtime {
    registeredFunctions: RegisteredFunctions;
    client: MeroxaJS;
    constructor(meroxaJS: MeroxaJS);
    resources(resourceName: string): Promise<Resource>;
    process(records: Records, fn: (rr: Record[]) => Record[]): Promise<Records>;
}
