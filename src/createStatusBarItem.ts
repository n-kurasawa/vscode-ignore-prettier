import { window, StatusBarAlignment } from "vscode";
import { EditService, enableText } from "./EditService";

export const createStatusBarItem = async () => {
  const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right);
  statusBarItem.command = "ignoreprettier.toggle";
  statusBarItem.tooltip = "Add / Remove from .prettierignore";
  try {
    statusBarItem.text = await new EditService(
      statusBarItem
    ).getStatusBarText();
  } catch (e) {
    statusBarItem.text = enableText;
  }

  statusBarItem.show();
  return statusBarItem;
};
