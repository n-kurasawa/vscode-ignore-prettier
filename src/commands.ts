import {
  window,
  workspace,
  FileSystemError,
  WorkspaceFolder,
  Uri,
  TextEditor,
} from "vscode";
import { posix, sep } from "path";
import { EOL } from "os";
import { removeFilename } from "./removeFilename";

const getFolder = (): WorkspaceFolder | null => {
  const folders = workspace.workspaceFolders;
  if (folders === undefined || folders.length > 1) {
    return null;
  }
  return folders[0];
};

const getPrettierignoreUri = (uri: Uri) => {
  return uri.with({
    path: posix.join(uri.path, ".prettierignore"),
  });
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

const extractFilenameFromRoodDir = (
  editor: TextEditor,
  folder: WorkspaceFolder
) => {
  return editor.document.fileName.replace(`${folder.uri.path}${sep}`, "");
};

const createIgnoreValue = (currentValue: string, filename: string) => {
  return Buffer.from(currentValue + filename + EOL, "utf8");
};

export const add = async () => {
  const folder = getFolder();
  if (folder === null) {
    console.error(`need a folder.`);
    return;
  }

  const editor = window.activeTextEditor;
  if (!editor) {
    console.error(`need active text editor.`);
    return;
  }

  const uri = getPrettierignoreUri(folder.uri);

  let currentValue = "";
  if (await exists(uri)) {
    const readData = await workspace.fs.readFile(uri);
    currentValue = Buffer.from(readData).toString("utf8").trimEnd() + EOL;
  }

  const filename = extractFilenameFromRoodDir(editor, folder);
  workspace.fs.writeFile(uri, createIgnoreValue(currentValue, filename));
};

export const remove = async () => {
  const folders = workspace.workspaceFolders;
  if (folders === undefined || folders.length > 1) {
    console.error(`need a folder.`);
    return;
  }

  const editor = window.activeTextEditor;
  if (!editor) {
    console.error(`need active text editor.`);
    return;
  }

  const folderUri = folders[0].uri;
  const uri = folderUri.with({
    path: posix.join(folderUri.path, ".prettierignore"),
  });

  let currentValue = "";
  try {
    const readData = await workspace.fs.readFile(uri);
    currentValue = Buffer.from(readData).toString("utf8");
  } catch (e) {
    if (e instanceof FileSystemError && e.code === "FileNotFound") {
      return;
    } else {
      throw e;
    }
  }

  const filename = editor.document.fileName.replace(
    `${folderUri.path}${sep}`,
    ""
  );
  const newValue = removeFilename(currentValue, filename);
  if (newValue.trim() === "") {
    workspace.fs.delete(uri);
  } else {
    workspace.fs.writeFile(uri, Buffer.from(newValue, "utf8"));
  }
};

export const toggle = async () => {
  console.log("toggle");
};
