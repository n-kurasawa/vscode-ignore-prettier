import { EOL } from "os";
import { posix, sep } from "path";
import {
  FileSystemError,
  StatusBarItem,
  TextEditor,
  Uri,
  window,
  workspace,
  WorkspaceFolder,
} from "vscode";
import { removeFilename } from "./removeFilename";

export const enableText = "$(check) Toggle Prettier";
const disableText = "$(circle-slash) Toggle Prettier";

export class EditService {
  private folder: WorkspaceFolder;
  private editor: TextEditor;
  private statusBarItem: StatusBarItem;

  constructor(statusBarItem: StatusBarItem) {
    this.statusBarItem = statusBarItem;
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
    this.disableStatusBarItemText();
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
    this.enableStatusBarItemText();
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
      this.enableStatusBarItemText();
    } else {
      newValue = currentValue + filename + EOL;
      this.disableStatusBarItemText();
    }
    if (newValue.trim() === "") {
      workspace.fs.delete(uri);
    } else {
      workspace.fs.writeFile(uri, Buffer.from(newValue, "utf8"));
    }
  }

  async getStatusBarText(): Promise<string> {
    if (await this.isActive()) {
      return enableText;
    } else {
      return disableText;
    }
  }

  private async isActive() {
    const filename = this.getOpenedFilename();
    const uri = this.getPrettierignoreUri();
    let currentValue = "";
    if (await this.exists(uri)) {
      const readData = await workspace.fs.readFile(uri);
      currentValue = Buffer.from(readData).toString("utf8").trimEnd() + EOL;
    }
    if (currentValue.includes(filename)) {
      return false;
    } else {
      return true;
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

  private disableStatusBarItemText(): void {
    this.statusBarItem.text = disableText;
  }

  private enableStatusBarItemText(): void {
    this.statusBarItem.text = enableText;
  }
}
