import { BaseError } from "../errors";
import { Result } from "ts-results";
export declare function run(nodeEnv: string, buildEnv: string, pathToDataApp: string): Promise<Result<true, BaseError>>;
export declare function generate(name: string): Promise<Result<true, BaseError>>;
