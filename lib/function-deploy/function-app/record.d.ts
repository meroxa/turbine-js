interface GenericObject {
    [key: string]: any;
}
export declare class Record {
    key: null;
    value: GenericObject;
    timestamp: null;
    _rawValue: null;
    constructor(record: any);
    deserialize(): this;
    serialize(): {
        key: null;
        value: string;
        timestamp: null;
    };
    get isJSONSchema(): any;
    get data(): any;
}
export {};
