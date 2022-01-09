import { sep, posix } from "path";
import {
  WorkspaceFolder,
  TextEditor,
  workspace,
  window,
  Uri,
  FileSystemError,
} from "vscode";

export class Vscode {
  private folder: WorkspaceFolder;
  private editor: TextEditor;
  constructor() {
    const folders = workspace.workspaceFolders;
    if (folders === undefined) {
      throw new Error("folder not open.");
    }
    if (folders.length > 1) {
      throw new Error("multiple folders open.");
    }
    this.folder = folders[0];

    if (!window.activeTextEditor) {
      throw new Error("no active editor.");
    }
    this.editor = window.activeTextEditor;
  }

  async exists(uri: Uri): Promise<boolean> {
    try {
      await workspace.fs.stat(uri);
    } catch (e) {
      if (e instanceof FileSystemError && e.code === "FileNotFound") {
        return false;
      }
      throw e;
    }
    return true;
  }

  getOpenedFilename(): string {
    return this.editor.document.fileName.replace(
      `${this.folder.uri.path}${sep}`,
      ""
    );
  }

  getPrettierignoreUri() {
    const uri = this.folder.uri;
    return uri.with({
      path: posix.join(uri.path, ".prettierignore"),
    });
  }

  async readFile(uri: Uri): Promise<string> {
    const readData = await workspace.fs.readFile(uri);
    return Buffer.from(readData).toString("utf8");
  }

  writeFile(uri: Uri, value: string) {
    return workspace.fs.writeFile(uri, Buffer.from(value, "utf8"));
  }

  deleteFile(uri: Uri) {
    return workspace.fs.delete(uri);
  }
}
