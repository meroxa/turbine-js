import { Record, RecordsArray } from "@meroxa/turbine-js-framework";

export interface Runtime {
  resources(name: string): Resource | Promise<Resource>;
  process(
    records: Records,
    fn: (rr: Record[]) => Record[],
    envVars: { [index: string]: string }
  ): Records | Promise<Records>;
}

export interface Resource {
  records(
    collection: string,
    connectorConfig: { [index: string]: string }
  ): Promise<Records>;
  write(
    records: Records,
    collection: string,
    connectorConfig: { [index: string]: string }
  ): void;
}

export { Record, RecordsArray };

export interface Records {
  records: RecordsArray;
  stream: string;
}

export interface RegisteredFunctions {
  [index: string]: (rr: RecordsArray) => RecordsArray;
}

export interface AppConfig {
  name: string;
  language: "js";
  environment: string;
  pipeline: string;
  resources: { [index: string]: string };
}