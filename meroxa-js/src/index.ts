import axios, { AxiosInstance } from "axios";
import { CreateConnectorRequest, ConnectorResponse } from "./types/connector";
import { ResourceResponse } from "./types/resource";

export * from "./types";
export class MeroxaJS {
  client: AxiosInstance;
  apiVersion = "v1";

  constructor() {
    let v = this.apiVersion;
    this.client = axios.create({
      baseURL: `https://api.meroxa.io/${v}`,
      timeout: 10000,
      headers: { Authorization: `Bearer ${process.env.AUTH_TOKEN}` },
    });
  }

  async getResource(nameOrID: string): Promise<ResourceResponse> {
    let response = await this.client.get(`/resources/${nameOrID}`);
    return response.data;
  }

  async createConnector(
    connector: CreateConnectorRequest
  ): Promise<ConnectorResponse> {
    let response = await this.client.post("/connectors", connector);
    return response.data;
  }
}
