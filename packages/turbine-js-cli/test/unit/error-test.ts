import { assertIsError, BaseError, APIError } from "../../src/errors";
import { AxiosResponse, AxiosError } from "axios";

QUnit.module("Unit | Error", () => {
  QUnit.test("BaseError: create with message", (assert) => {
    const subject = new BaseError("woops");

    assert.notOk(subject.wrappedError);
  });

  QUnit.test("BaseError: create with message and wrappedError", (assert) => {
    const previousError = new Error("ugh");
    const subject = new BaseError("woops", previousError);

    assert.deepEqual(subject.wrappedError, previousError);
  });

  QUnit.test("BaseError: unwraps a message", (assert) => {
    const error = new BaseError("woops");
    const unwrappedError = error.unwrapMessage();

    assert.strictEqual(unwrappedError, "woops");
  });

  QUnit.test("BaseError: unwraps a message with a wrapped error", (assert) => {
    const previousError = new Error("ugh");
    const error = new BaseError("woops", previousError);
    const unwrappedError = error.unwrapMessage();

    assert.strictEqual(unwrappedError, "woops : ugh");
  });

  QUnit.test("assertIsError: throws for non-error objects", (assert) => {
    assert.throws(
      function () {
        assertIsError("actuallyfine");
      },
      /actuallyfine/,
      "it rethrows the error"
    );
  });

  QUnit.test(
    "APIError: it properly displays the details and message",
    (assert) => {
      const responseData = {
        message: "uh oh",
        details: [
          ["queen", ["freddie", "mercury"]],
          ["the clash", ["joe", "strummer"]],
        ],
      };
      const response: AxiosResponse = {
        data: responseData,
        status: 500,
      } as AxiosResponse;
      const axiosError = {
        config: {
          method: "GET",
          baseURL: "http://api.meroxa.io",
          url: "/foo",
        },
        response: response,
      } as AxiosError<any>;

      const error = new APIError(axiosError);

      assert.strictEqual(
        error.unwrapMessage(),
        "GET http://api.meroxa.io/foo : API error : uh oh ; 2 detail(s) provided\n1. queen: freddie. mercury.\n2. the clash: joe. strummer.\n"
      );
    }
  );
});
