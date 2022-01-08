import * as assert from "assert";
import { suite } from "mocha";
import { commands, Uri, window } from "vscode";
import { Vscode } from "../../vscode";

suite("Vscode", () => {
  suite("no active editor", () => {
    test("init", () => {
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

    test("init", () => {
      try {
        const vscode = new Vscode();
        assert.ok(vscode);
      } catch (e) {
        assert.fail();
      }
    });

    test("exists", async () => {
      const file = `${process.cwd()}/test-target/test.js`;
      const actual = await new Vscode().exists(Uri.parse(file));
      assert.strictEqual(actual, true);
    });

    test("not exists", async () => {
      const notexists = `${process.cwd()}/test-target/not-exists.js`;
      const actual = await new Vscode().exists(Uri.parse(notexists));
      assert.strictEqual(actual, false);
    });

    test("getOpenedFilename", () => {
      const actual = new Vscode().getOpenedFilename();
      assert.strictEqual(actual, "test.js");
    });

    test("getPrettierignoreUri", () => {
      const actual = new Vscode().getPrettierignoreUri();
      assert.strictEqual(
        actual.path,
        `${process.cwd()}/test-target/.prettierignore`
      );
    });

    test("readFile", async () => {
      const uri = Uri.parse(`${process.cwd()}/test-target/test.js`);
      const actual = await new Vscode().readFile(uri);
      assert.strictEqual(actual, "test\n");
    });
  });
});
