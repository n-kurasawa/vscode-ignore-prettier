import * as assert from "assert";
import { removeFilename } from "../../commands";

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

suite("commands test", () => {
  test("removeFilename", () => {
    const results = removeFilename(current, "remove/filename");
    assert.strictEqual(results, expected);
  });
});
