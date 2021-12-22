import { commands, ExtensionContext, window, TextEditor } from "vscode";
import { add, remove, toggle, getStatusBarText } from "./commands";
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
  const activeTextEditorChangeListener = window.onDidChangeActiveTextEditor(
    async (e: TextEditor | undefined) => {
      if (e) {
        statusBarItem.text = await getStatusBarText();
      }
    }
  );

  context.subscriptions.push(statusBarItem);
  context.subscriptions.push(addCommand, removeCommand, toggleCommand);
  context.subscriptions.push(activeTextEditorChangeListener);
}
