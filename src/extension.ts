import { commands, ExtensionContext } from "vscode";
import { add, remove } from "./commands";

export function activate(context: ExtensionContext) {
  console.log('Extension "vscode-prettierignore" is activated.');

  const addCommand = commands.registerCommand("prettierignore.add", add);
  const removeCommand = commands.registerCommand(
    "prettierignore.remove",
    remove
  );

  context.subscriptions.push(addCommand, removeCommand);
}
