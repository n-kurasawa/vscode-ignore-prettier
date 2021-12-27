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

const enableText = "$(check) Toggle Prettier";
const disableText = "$(circle-slash) Toggle Prettier";

const isActive = async (): Promise<boolean> => {
  const folder = getFolder();
  if (folder === null) {
    return false;
  }

  const editor = window.activeTextEditor;
  if (!editor) {
    return false;
  }

  const uri = getPrettierignoreUri(folder.uri);

  let currentValue = "";
  if (await exists(uri)) {
    const readData = await workspace.fs.readFile(uri);
    currentValue = Buffer.from(readData).toString("utf8").trimEnd() + EOL;
  }
  const filename = extractFilenameFromRoot(editor, folder);
  if (currentValue.includes(filename)) {
    return false;
  } else {
    return true;
  }
};

const getPrettierignoreUri = (uri: Uri) => {
  return uri.with({
    path: posix.join(uri.path, ".prettierignore"),
  });
};

const addFilename = (currentValue: string, filename: string) => {
  return currentValue + filename + EOL;
};

const getFolder = (): WorkspaceFolder | null => {
  const folders = workspace.workspaceFolders;
  if (folders === undefined || folders.length > 1) {
    return null;
  }
  return folders[0];
};

const extractFilenameFromRoot = (
  editor: TextEditor,
  folder: WorkspaceFolder
) => {
  return editor.document.fileName.replace(`${folder.uri.path}${sep}`, "");
};

const exists = async (uri: Uri): Promise<boolean> => {
  try {
    await workspace.fs.stat(uri);
  } catch (e) {
    if (e instanceof FileSystemError && e.code === "FileNotFound") {
      return false;
    }
    throw e;
  }
  return true;
};

class EditService {
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
  remove() {}
  toggle() {}
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

export class Vscode {
  constructor(private statusBarItem: StatusBarItem) {}

  getOpenedFilename(): string {
    const folder = getFolder();
    if (folder === null) {
      return "";
    }

    const editor = window.activeTextEditor;
    if (!editor) {
      return "";
    }

    const filename = extractFilenameFromRoot(editor, folder);
    return filename;
  }

  async addFilename(filename: string): Promise<void> {
    const folder = getFolder();
    if (folder === null) {
      return;
    }

    let currentValue = "";
    const uri = getPrettierignoreUri(folder.uri);
    if (await exists(uri)) {
      const readData = await workspace.fs.readFile(uri);
      currentValue = Buffer.from(readData).toString("utf8").trimEnd() + EOL;
    }

    const newValue = addFilename(currentValue, filename);
    workspace.fs.writeFile(uri, Buffer.from(newValue, "utf8"));
    this.disableStatusBarItemText();
  }

  async removeFilename(filename: string): Promise<void> {
    const folder = getFolder();
    if (folder === null) {
      return;
    }

    let currentValue = "";
    const uri = getPrettierignoreUri(folder.uri);
    if (await exists(uri)) {
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

  async toggleFilename(filename: string): Promise<void> {
    const folder = getFolder();
    if (folder === null) {
      return;
    }

    let currentValue = "";
    const uri = getPrettierignoreUri(folder.uri);
    if (await exists(uri)) {
      const readData = await workspace.fs.readFile(uri);
      currentValue = Buffer.from(readData).toString("utf8").trimEnd() + EOL;
    }

    let newValue = "";
    if (currentValue.includes(filename)) {
      newValue = removeFilename(currentValue, filename);
      this.enableStatusBarItemText();
    } else {
      newValue = addFilename(currentValue, filename);
      this.disableStatusBarItemText();
    }
    if (newValue.trim() === "") {
      workspace.fs.delete(uri);
    } else {
      workspace.fs.writeFile(uri, Buffer.from(newValue, "utf8"));
    }
  }

  private disableStatusBarItemText(): void {
    this.statusBarItem.text = disableText;
  }

  private enableStatusBarItemText(): void {
    this.statusBarItem.text = enableText;
  }
}

export const getStatusBarText = async (): Promise<string> => {
  if (await isActive()) {
    return enableText;
  } else {
    return disableText;
  }
};
