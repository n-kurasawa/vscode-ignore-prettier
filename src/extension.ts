import { commands, ExtensionContext } from "vscode";
import { add, remove } from "./commands";

export function activate(context: ExtensionContext) {
  console.log('Extension "vscode-ignore-prettier" is activated.');

  const addCommand = commands.registerCommand("ignoreprettier.add", add);
  const removeCommand = commands.registerCommand(
    "ignoreprettier.remove",
    remove
  );

  context.subscriptions.push(addCommand, removeCommand);
}
