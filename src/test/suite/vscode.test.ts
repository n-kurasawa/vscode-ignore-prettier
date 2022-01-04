import * as assert from "assert";
import { Vscode } from "../../vscode";

suite("vscode test", () => {
  test("init exsits folder", async () => {
    try {
      new Vscode();
      assert.fail();
    } catch (e) {
      if (e instanceof Error) {
        assert.strictEqual(e.message, "no active editor.");
      } else {
        assert.fail();
      }
    }
  });
});
