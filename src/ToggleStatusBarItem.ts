import { EOL } from "os";
import { sep, posix } from "path";
import {
  window,
  StatusBarAlignment,
  StatusBarItem,
  workspace,
  FileSystemError,
  Uri,
} from "vscode";

const enableText = "$(check) Toggle Prettier";
const disableText = "$(circle-slash) Toggle Prettier";

export class ToggleStatusBarItem {
  private statusBarItem: StatusBarItem;
  constructor() {
    this.statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right);
    this.statusBarItem.command = "ignoreprettier.toggle";
    this.statusBarItem.tooltip = "Add / Remove from .prettierignore";
  }

  async show() {
    await this.setText();
    this.statusBarItem.show();
  }

  getItem() {
    return this.statusBarItem;
  }

  disableStatusBarItemText(): void {
    this.statusBarItem.text = disableText;
  }

  enableStatusBarItemText(): void {
    this.statusBarItem.text = enableText;
  }

  async setText() {
    if (await this.isActive()) {
      this.enableStatusBarItemText();
    } else {
      this.disableStatusBarItemText();
    }
  }

  // TODO: extract class and commonalize
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

  // TODO: extract class and commonalize
  private async isActive() {
    const folders = workspace.workspaceFolders;
    if (folders === undefined || folders.length > 1) {
      return false;
    }
    const folder = folders[0];
    if (!window.activeTextEditor) {
      return false;
    }
    const editor = window.activeTextEditor;

    const filename = editor.document.fileName.replace(
      `${folder.uri.path}${sep}`,
      ""
    );

    const uri = folder.uri.with({
      path: posix.join(folder.uri.path, ".prettierignore"),
    });

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
}
