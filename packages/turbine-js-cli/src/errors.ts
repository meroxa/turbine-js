import { AxiosError } from "axios";

export class BaseError extends Error {
  wrappedError?: Error;

  constructor(message: string, wrappedError?: Error) {
    super(message);
    if (wrappedError) {
      this.wrappedError = wrappedError;
    }
  }

  unwrapMessage(): string {
    if (!this.wrappedError) {
      return this.message;
    }

    if (this.wrappedError instanceof BaseError) {
      return `${this.message} : ${this.wrappedError.unwrapMessage()}`;
    }

    return `${this.message} : ${this.wrappedError.message}`;
  }
}

export class APIError extends BaseError {
  constructor(messageOrError: string | AxiosError, wrappedError?: AxiosError) {
    if (typeof messageOrError === "string") {
      super(messageOrError, wrappedError);
    } else {
      const error = messageOrError;
      super("API error", error);
    }
  }

  unwrapMessage(): string {
    let unwrapped = super.unwrapMessage();
    const wrappedError = this.wrappedError as AxiosError;

    const method = wrappedError.config.method!.toUpperCase();
    const url = wrappedError.config.baseURL! + wrappedError.config.url!;

    unwrapped = `${method} ${url} : ${unwrapped}`;

    if (wrappedError.response?.data.message) {
      unwrapped = `${unwrapped} : ${wrappedError.response?.data.message}`;

      let details = wrappedError.response?.data.details;
      if (details.length > 0) {
        let report = `; ${details.length} detail(s) provided\n`;
        let count = 1;
        for (let [key, value] of details) {
          let joined = value.join(". ");
          report = report + `${count++}. ${key}: ${joined}\n`;
        }

        unwrapped = `${unwrapped} ${details}`;
      }
    }

    return unwrapped;
  }
}

export function assertIsError(err: any): asserts err is Error {
  if (!(err instanceof Error)) {
    throw err;
  }
}
