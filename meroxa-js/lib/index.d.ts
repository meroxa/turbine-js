import { AxiosInstance } from "axios";
import { CreateConnectorRequest, ConnectorResponse } from "./types/connector";
import { ResourceResponse } from "./types/resource";
export * from "./types";
export declare class MeroxaJS {
    client: AxiosInstance;
    apiVersion: string;
    constructor();
    getResource(nameOrID: string): Promise<ResourceResponse>;
    createConnector(connector: CreateConnectorRequest): Promise<ConnectorResponse>;
}
