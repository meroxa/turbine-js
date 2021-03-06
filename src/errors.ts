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
    const unwrapped = super.unwrapMessage();
    const wrappedError = this.wrappedError as AxiosError;
    if (wrappedError.response?.data.message) {
      return `${unwrapped} : ${wrappedError.response?.data.message}`;
    }

    return unwrapped;
  }
}

export function assertIsError(err: any): asserts err is Error {
  if (!(err instanceof Error)) {
    throw err;
  }
}
