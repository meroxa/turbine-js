import { Resource, Record, Records, Runtime, AppConfig } from "./types";
export declare class LocalRuntime implements Runtime {
    appConfig: AppConfig;
    pathToApp: string;
    constructor(appConfig: AppConfig, pathToApp: string);
    resources(resourceName: string): Resource;
    process(records: Records, fn: (rr: Record[]) => Record[]): Records;
}
