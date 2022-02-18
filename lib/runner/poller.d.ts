interface PollerOptions {
    fn: Function;
    validate: Function;
    interval: number;
    maxAttempts: number;
}
export declare function poller({ fn, validate, interval, maxAttempts, }: PollerOptions): Promise<any>;
export {};
