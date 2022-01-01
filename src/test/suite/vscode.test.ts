import * as assert from "assert";
import { Uri, workspace } from "vscode";
import { Vscode } from "../../vscode";

function addFolder(dir: string, name: string) {
  const result = workspace.updateWorkspaceFolders(
    workspace.workspaceFolders ? workspace.workspaceFolders.length : 0,
    null,
    {
      uri: Uri.parse(dir),
      name,
    }
  );
}

suite("vscode test", () => {
  test("init no folder", () => {
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

  test("init exsits folder", () => {
    addFolder("test", "folder");
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
