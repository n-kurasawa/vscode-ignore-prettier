import { commands, ExtensionContext, window, TextEditor } from "vscode";
import { addFunc, removeFunc, toggleFunc } from "./commands";
import { createStatusBarItem } from "./createStatusBarItem";
import { EditService, enableText } from "./EditService";

export async function activate(context: ExtensionContext) {
  console.log('Extension "vscode-ignore-prettier" is activated.');

  const statusBarItem = await createStatusBarItem();
  const addCommand = commands.registerCommand(
    "ignoreprettier.add",
    addFunc(statusBarItem)
  );
  const removeCommand = commands.registerCommand(
    "ignoreprettier.remove",
    removeFunc(statusBarItem)
  );
  const toggleCommand = commands.registerCommand(
    "ignoreprettier.toggle",
    toggleFunc(statusBarItem)
  );
  const activeTextEditorChangeListener = window.onDidChangeActiveTextEditor(
    async (e: TextEditor | undefined) => {
      if (e) {
        try {
          statusBarItem.text = await new EditService(
            statusBarItem
          ).getStatusBarText();
        } catch (e) {
          statusBarItem.text = enableText;
        }
      }
    }
  );

  context.subscriptions.push(statusBarItem);
  context.subscriptions.push(addCommand, removeCommand, toggleCommand);
  context.subscriptions.push(activeTextEditorChangeListener);
}
