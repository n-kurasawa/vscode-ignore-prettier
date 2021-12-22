import { window, workspace, FileSystemError } from "vscode";
import type { WorkspaceFolder, Uri, TextEditor } from "vscode";
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

const extractFilenameFromRoot = (
  editor: TextEditor,
  folder: WorkspaceFolder
) => {
  return editor.document.fileName.replace(`${folder.uri.path}${sep}`, "");
};

const addFilename = (currentValue: string, filename: string) => {
  return currentValue + filename + EOL;
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

  const filename = extractFilenameFromRoot(editor, folder);
  workspace.fs.writeFile(
    uri,
    Buffer.from(addFilename(currentValue, filename), "utf8")
  );
};

export const remove = async () => {
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

  const filename = extractFilenameFromRoot(editor, folder);

  const newValue = removeFilename(currentValue, filename);
  if (newValue.trim() === "") {
    workspace.fs.delete(uri);
  } else {
    workspace.fs.writeFile(uri, Buffer.from(newValue, "utf8"));
  }
};

export const toggle = async () => {
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
  const filename = extractFilenameFromRoot(editor, folder);

  let newValue = removeFilename(currentValue, filename);
  if (currentValue.includes(filename)) {
    newValue = removeFilename(currentValue, filename);
  } else {
    newValue = addFilename(currentValue, filename);
  }
  if (newValue.trim() === "") {
    workspace.fs.delete(uri);
  } else {
    workspace.fs.writeFile(uri, Buffer.from(newValue, "utf8"));
  }
};

const isActive = async (): Promise<boolean> => {
  const folder = getFolder();
  if (folder === null) {
    console.error(`need a folder.`);
    return false;
  }

  const editor = window.activeTextEditor;
  if (!editor) {
    console.error(`need active text editor.`);
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

export const getStatusBarText = async (): Promise<string> => {
  if (await isActive()) {
    return "$(check) Toggle Prettier";
  } else {
    return "$(x) Toggle Prettier";
  }
};
