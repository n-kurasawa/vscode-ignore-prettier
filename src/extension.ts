import { commands, ExtensionContext } from "vscode";
import { add, remove, toggle } from "./commands";
import { createStatusBarItem } from "./createStatusBarItem";

export function activate(context: ExtensionContext) {
  console.log('Extension "vscode-ignore-prettier" is activated.');

  const statusBarItem = createStatusBarItem();
  const addCommand = commands.registerCommand("ignoreprettier.add", add);
  const removeCommand = commands.registerCommand(
    "ignoreprettier.remove",
    remove
  );
  const toggleCommand = commands.registerCommand(
    "ignoreprettier.toggle",
    toggle
  );

  context.subscriptions.push(statusBarItem);
  context.subscriptions.push(addCommand, removeCommand, toggleCommand);
}
