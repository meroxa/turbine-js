import { Resource, Record, Records, Runtime } from "../types";
export declare class LocalRuntime implements Runtime {
    fixturesPath: string;
    constructor(fixturesPath: string);
    resources(resourceName: string): Resource;
    process(records: Records, fn: (rr: Record[]) => Record[]): Records;
}
