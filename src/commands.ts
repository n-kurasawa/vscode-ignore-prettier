import { window, workspace, FileSystemError } from "vscode";
import { posix, sep } from "path";
import { EOL } from "os";

export const add = async () => {
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
    currentValue = Buffer.from(readData).toString("utf8").trimEnd() + EOL;
  } catch (e) {
    if (!(e instanceof FileSystemError && e.code === "FileNotFound")) {
      throw e;
    }
  }

  const filename = editor.document.fileName.replace(
    `${folderUri.path}${sep}`,
    ""
  );
  workspace.fs.writeFile(
    uri,
    Buffer.from(currentValue + filename + EOL, "utf8")
  );
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

export const removeFilename = (current: string, filename: string): string => {
  const escapedFilename = escapeRegExp(filename);
  const regexp = new RegExp(`^${escapedFilename}$[\\n|\\r|\\r\\n]?`, "gm");
  return current.replace(regexp, "");
};

const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^=!:${}()|[\]\/\\]/g, "\\$&");
};
