import { window, StatusBarAlignment } from "vscode";

export const createStatusBarItem = () => {
  const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right);
  statusBarItem.text = "Ignore Prettier";
  statusBarItem.command = "ignoreprettier.toggle";
  statusBarItem.tooltip = "Add / Remove from .prettierignore";
  statusBarItem.show();
  return statusBarItem;
};
