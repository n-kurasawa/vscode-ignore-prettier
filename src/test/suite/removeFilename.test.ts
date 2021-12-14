import * as assert from "assert";
import { removeFilename } from "../../removeFilename";

const current = `not/remove/filename
remove/filename
remove/filename/not
remove/filename

emptyline
remove/filename`;

const expected = `not/remove/filename
remove/filename/not

emptyline
`;

suite("removeFilename test", () => {
  test("removeFilename", () => {
    const results = removeFilename(current, "remove/filename");
    assert.strictEqual(results, expected);
  });
});
