import * as assert from "assert";
import { suite } from "mocha";
import { commands, Uri, window } from "vscode";
import { Vscode } from "../../vscode";

suite("vscode test", () => {
  suite("no active editor", () => {
    test("init", async () => {
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

  suite("has active editor", () => {
    suiteSetup(async () => {
      const file = `${process.cwd()}/test-target/test.js`;
      await window.showTextDocument(Uri.parse(file));
    });

    suiteTeardown(async () => {
      await commands.executeCommand("workbench.action.closeActiveEditor");
    });

    test("init", async () => {
      try {
        const vscode = new Vscode();
        assert.ok(vscode);
      } catch (e) {
        assert.fail();
      }
    });

    test("exists", async () => {
      const file = `${process.cwd()}/test-target/test.js`;
      const vscode = new Vscode();
      const actual = await vscode.exists(Uri.parse(file));
      assert.strictEqual(actual, true);
    });

    test("not exists", async () => {
      const vscode = new Vscode();
      const notexists = `${process.cwd()}/test-target/not-exists.js`;
      const actual = await vscode.exists(Uri.parse(notexists));
      assert.strictEqual(actual, false);
    });
  });
});
