import * as assert from "assert";
import { promises } from "fs";
import { Uri, workspace } from "vscode";
import { Vscode } from "../../vscode";

async function createFolder(dir: string) {
  await promises.mkdir(dir, { recursive: true });

  workspace.updateWorkspaceFolders(
    workspace.workspaceFolders ? workspace.workspaceFolders.length : 0,
    null,
    {
      uri: Uri.parse(dir),
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

  test("init exsits folder", async () => {
    const dir = `${process.cwd()}/test`;
    await createFolder(dir);

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
