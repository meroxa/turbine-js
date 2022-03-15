import { Record, Records, RegisteredFunctions } from "./types";

export class InfoRuntime {
  registeredFunctions: RegisteredFunctions = {};

  get functionsList() {
    return Object.keys(this.registeredFunctions);
  }

  resources(resourceName: string): InfoResource {
    return new InfoResource();
  }

  process(records: Records, fn: (rr: Record[]) => Record[]): void {
    this.registeredFunctions[fn.name] = fn;
  }
}

class InfoResource {
  records(collection: string): void {}
  write(records: Records, collection: string): void {}
}
