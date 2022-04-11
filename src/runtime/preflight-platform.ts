import { Client } from "meroxa-js";
import { APIError, BaseError } from "../errors";
import { Record, Records } from "./types";

export class PreflightPlatformRuntime {
  client: Client;
  platformRunErrors: string[];

  constructor(meroxaJS: Client) {
    this.client = meroxaJS;
    this.platformRunErrors = [];
  }

  async resources(resourceName: string): Promise<PreflightPlatformResource> {
    try {
      await this.client.resources.get(resourceName);
      return new PreflightPlatformResource();
    } catch (e: any) {
      if (e.response && e.response.status === 404) {
        this.platformRunErrors.push(
          `Cannot find resource ${resourceName} on the Meroxa platform, please make sure it exists before using 'turbine.resources('${resourceName}')' in your app.`
        );

        return new PreflightPlatformResource();
      }

      if (e.response) {
        console.log(e.response);
        throw new APIError(e);
      }

      if (e.request) {
        throw new BaseError("no server response");
      }

      throw e;
    }
  }

  process(records: Records, fn: (rr: Record[]) => Record[]): void {}
}

class PreflightPlatformResource {
  records(collection: string): void {}
  write(records: Records, collection: string): void {}
}
