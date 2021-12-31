import * as assert from "assert";
import { Vscode } from "../../vscode";

suite("vscode test", () => {
  test("init", () => {
    try {
      new Vscode();
      assert.fail();
    } catch (e) {
      if (e instanceof Error) {
        assert.strictEqual(e.message, "folder not open.");
      } else {
        assert.fail();
      }
    }
  });
});
