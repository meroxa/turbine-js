export class BaseError extends Error {
  wrappedError?: Error;

  constructor(message: string, wrappedError?: Error) {
    super(message);
    if (wrappedError) {
      this.wrappedError = wrappedError;
    }
  }

  unwrapMessage(): string {
    if (!this.wrappedError || !this.wrappedError.message) {
      return this.message;
    }

    if (this.wrappedError instanceof BaseError) {
      return `${this.message} : ${this.wrappedError.unwrapMessage()}`;
    }

    return `${this.message} : ${this.wrappedError.message}`;
  }
}

export function assertIsError(err: any): asserts err is Error {
  if (!(err instanceof Error)) {
    throw err;
  }
}
