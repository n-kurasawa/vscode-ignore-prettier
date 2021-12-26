import { window, StatusBarAlignment } from "vscode";
import { getStatusBarText } from "./vscode";

export const createStatusBarItem = async () => {
  const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right);
  statusBarItem.command = "ignoreprettier.toggle";
  statusBarItem.tooltip = "Add / Remove from .prettierignore";
  statusBarItem.text = await getStatusBarText();
  statusBarItem.show();
  return statusBarItem;
};
