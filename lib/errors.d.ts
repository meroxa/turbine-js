import { AxiosError } from "axios";
export declare class BaseError extends Error {
    wrappedError?: Error;
    constructor(message: string, wrappedError?: Error);
    unwrapMessage(): string;
}
export declare class APIError extends BaseError {
    constructor(message: string | AxiosError, wrappedError?: AxiosError);
    unwrapMessage(): string;
}
export declare function assertIsError(err: any): asserts err is Error;
