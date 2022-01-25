export interface Runtime {
  resources(name: string): Resource | Promise<Resource>;
  process(
    records: Records,
    fn: (rr: Record[]) => Record[]
  ): Records | Promise<Records>;
}

export interface Resource {
  records(collection: string): Promise<Records>;
  write(records: Records, collection: string): void;
}

export interface Record {
  key: string;
  payload: any;
  timestamp: number;
}

export interface Records {
  records: Record[];
  stream: string;
}

export interface RegisteredFunctions {
  [index: string]: (rr: Record[]) => Record[];
}
