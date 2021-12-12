import { commands, ExtensionContext } from "vscode";
import { add } from "./commands";

export function activate(context: ExtensionContext) {
  console.log('Extension "vscode-prettierignore" is activated.');

  const addCommand = commands.registerCommand("prettierignore.add", add);

  context.subscriptions.push(addCommand);
}
