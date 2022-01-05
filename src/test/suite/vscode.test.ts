import * as assert from "assert";
import { commands, Uri, window } from "vscode";
import { Vscode } from "../../vscode";

suite("vscode test", () => {
  test("init no active editor", async () => {
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

  test("init", async () => {
    const file = `${process.cwd()}/test-target/test.js`;
    await window.showTextDocument(Uri.parse(file));
    try {
      const vscode = new Vscode();
      assert.ok(vscode);
    } catch (e) {
      assert.fail();
    }
    commands.executeCommand("workbench.action.closeActiveEditor");
  });
});
