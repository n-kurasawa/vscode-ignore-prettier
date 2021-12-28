import { EOL } from "os";
import { posix, sep } from "path";
import {
  FileSystemError,
  TextEditor,
  Uri,
  window,
  workspace,
  WorkspaceFolder,
} from "vscode";
import { removeFilename } from "./removeFilename";
import { ToggleStatusBarItem } from "./ToggleStatusBarItem";

export class EditService {
  private folder: WorkspaceFolder;
  private editor: TextEditor;
  private toggleStatusBarItem: ToggleStatusBarItem;

  constructor(toggleStatusBarItem: ToggleStatusBarItem) {
    this.toggleStatusBarItem = toggleStatusBarItem;
    const folders = workspace.workspaceFolders;
    if (folders === undefined || folders.length > 1) {
      throw new Error("");
    }
    this.folder = folders[0];
    if (!window.activeTextEditor) {
      throw new Error("");
    }
    this.editor = window.activeTextEditor;
  }

  async add() {
    const filename = this.getOpenedFilename();
    const uri = this.getPrettierignoreUri();
    let currentValue = "";
    if (await this.exists(uri)) {
      const readData = await workspace.fs.readFile(uri);
      currentValue = Buffer.from(readData).toString("utf8").trimEnd() + EOL;
    }
    const newValue = currentValue + filename + EOL;
    workspace.fs.writeFile(uri, Buffer.from(newValue, "utf8"));
    this.toggleStatusBarItem.disableStatusBarItemText();
  }

  async remove() {
    const filename = this.getOpenedFilename();
    const uri = this.getPrettierignoreUri();
    let currentValue = "";
    if (await this.exists(uri)) {
      const readData = await workspace.fs.readFile(uri);
      currentValue = Buffer.from(readData).toString("utf8").trimEnd() + EOL;
    }
    const newValue = removeFilename(currentValue, filename);
    if (newValue.trim() === "") {
      workspace.fs.delete(uri);
    } else {
      workspace.fs.writeFile(uri, Buffer.from(newValue, "utf8"));
    }
    this.toggleStatusBarItem.enableStatusBarItemText();
  }

  async toggle() {
    const filename = this.getOpenedFilename();
    const uri = this.getPrettierignoreUri();
    let currentValue = "";
    if (await this.exists(uri)) {
      const readData = await workspace.fs.readFile(uri);
      currentValue = Buffer.from(readData).toString("utf8").trimEnd() + EOL;
    }
    let newValue = "";
    if (currentValue.includes(filename)) {
      newValue = removeFilename(currentValue, filename);
      this.toggleStatusBarItem.enableStatusBarItemText();
    } else {
      newValue = currentValue + filename + EOL;
      this.toggleStatusBarItem.disableStatusBarItemText();
    }
    if (newValue.trim() === "") {
      workspace.fs.delete(uri);
    } else {
      workspace.fs.writeFile(uri, Buffer.from(newValue, "utf8"));
    }
  }

  private async exists(uri: Uri): Promise<boolean> {
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

  private getOpenedFilename(): string {
    return this.editor.document.fileName.replace(
      `${this.folder.uri.path}${sep}`,
      ""
    );
  }

  private getPrettierignoreUri = () => {
    const uri = this.folder.uri;
    return uri.with({
      path: posix.join(uri.path, ".prettierignore"),
    });
  };
}
