import { window, workspace } from "vscode";
import { posix, sep } from "path";

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

  const filename = editor.document.fileName.replace(
    `${folderUri.path}${sep}`,
    ""
  );
  workspace.fs.writeFile(uri, Buffer.from(filename, "utf8"));
};
