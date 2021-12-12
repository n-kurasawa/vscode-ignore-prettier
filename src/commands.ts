import { window, workspace, Uri } from "vscode";
import { TextEncoder } from "util";

export const add = () => {
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

  const uri = Uri.file(`${folders[0].uri.path}/.prettierignore`);
  const filename = editor.document.fileName.replace(
    `${folders[0].uri.path}/`,
    ""
  );
  workspace.fs.writeFile(uri, new TextEncoder().encode(filename));
};
