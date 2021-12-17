class MeroxaAPIClient {
  client = null;
  apiVersion = "v1";

  constructor() {
    let v = this.apiVersion;
    this.client = axios.create({
      baseURL: `https://api.meroxa.io/${v}`,
      timeout: 10000,
      headers: { Authorization: `Bearer ${process.env.AUTH_TOKEN}` },
    });
  }

  async getResourceByNameOrID(nameOrID) {
    let response = await this.client.get(`/resources/${nameOrID}`);
    return response.data;
  }

  async createConnector(newConnector) {
    // TODO
    // let response = await this.client.post("/connectors", {
    //   name: newConnector.name,
    //   resource_id: newConnector.resource_id,
    //   pipeline_id: 123,
    //   config: { input: "fa", f: "a" },
    //   metadata: { "mx:connectorType": "source" },
    // });

    let response = { data: {} };

    return response.data;
  }
}
