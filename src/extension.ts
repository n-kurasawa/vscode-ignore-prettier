import { commands, ExtensionContext, window, TextEditor } from "vscode";
import { addFunc, removeFunc, toggleFunc } from "./commands";
import { createStatusBarItem } from "./createStatusBarItem";
import { getStatusBarText, Vscode } from "./vscode";

export async function activate(context: ExtensionContext) {
  console.log('Extension "vscode-ignore-prettier" is activated.');

  const statusBarItem = await createStatusBarItem();
  const vscode = new Vscode(statusBarItem);
  const addCommand = commands.registerCommand(
    "ignoreprettier.add",
    addFunc(vscode)
  );
  const removeCommand = commands.registerCommand(
    "ignoreprettier.remove",
    removeFunc(vscode)
  );
  const toggleCommand = commands.registerCommand(
    "ignoreprettier.toggle",
    toggleFunc(vscode)
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
