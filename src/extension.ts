import { commands, ExtensionContext, window, TextEditor } from "vscode";
import { addFunc, removeFunc, toggleFunc } from "./commands";
import { ToggleStatusBarItem } from "./ToggleStatusBarItem";

export async function activate(context: ExtensionContext) {
  console.log('Extension "vscode-ignore-prettier" is activated.');

  const toggleStatusBarItem = new ToggleStatusBarItem();
  toggleStatusBarItem.show();

  const addCommand = commands.registerCommand(
    "ignoreprettier.add",
    addFunc(toggleStatusBarItem)
  );
  const removeCommand = commands.registerCommand(
    "ignoreprettier.remove",
    removeFunc(toggleStatusBarItem)
  );
  const toggleCommand = commands.registerCommand(
    "ignoreprettier.toggle",
    toggleFunc(toggleStatusBarItem)
  );
  const activeTextEditorChangeListener = window.onDidChangeActiveTextEditor(
    async (e: TextEditor | undefined) => {
      if (e) {
        toggleStatusBarItem.setText();
      }
    }
  );

  context.subscriptions.push(toggleStatusBarItem.getItem());
  context.subscriptions.push(addCommand, removeCommand, toggleCommand);
  context.subscriptions.push(activeTextEditorChangeListener);
}
