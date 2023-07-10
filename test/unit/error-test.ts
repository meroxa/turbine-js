import { assertIsError, BaseError } from "../../src/errors";

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
      "it rethrows the error",
    );
  });
});
