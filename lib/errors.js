"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertIsError = exports.APIError = exports.BaseError = void 0;
class BaseError extends Error {
    constructor(message, wrappedError) {
        super(message);
        if (wrappedError) {
            this.wrappedError = wrappedError;
        }
    }
    unwrapMessage() {
        if (!this.wrappedError) {
            return this.message;
        }
        if (this.wrappedError instanceof BaseError) {
            return `${this.message} : ${this.wrappedError.unwrapMessage()}`;
        }
        return `${this.message} : ${this.wrappedError.message}`;
    }
}
exports.BaseError = BaseError;
class APIError extends BaseError {
    constructor(message, wrappedError) {
        if (typeof message === "string") {
            super(message, wrappedError);
        }
        else {
            const error = message;
            super("API error", error);
        }
    }
    unwrapMessage() {
        var _a, _b;
        const unwrapped = super.unwrapMessage();
        const wrappedError = this.wrappedError;
        if ((_a = wrappedError.response) === null || _a === void 0 ? void 0 : _a.data.message) {
            return `${unwrapped} : ${(_b = wrappedError.response) === null || _b === void 0 ? void 0 : _b.data.message}`;
        }
        return unwrapped;
    }
}
exports.APIError = APIError;
function assertIsError(err) {
    if (!(err instanceof Error)) {
        throw err;
    }
}
exports.assertIsError = assertIsError;
//# sourceMappingURL=errors.js.map