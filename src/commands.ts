import { EditService } from "./EditService";
import { ToggleStatusBarItem } from "./ToggleStatusBarItem";
import { Vscode } from "./vscode";

const createVscode = (): Vscode | null => {
  let vscode: Vscode;
  try {
    vscode = new Vscode();
  } catch (e) {
    return null;
  }
  return vscode;
};

export const addFunc = (toggleStatusBarItem: ToggleStatusBarItem) => {
  return () => {
    const vscode = createVscode();
    if (vscode === null) {
      return;
    }
    new EditService(toggleStatusBarItem, vscode).add();
  };
};

export const removeFunc = (toggleStatusBarItem: ToggleStatusBarItem) => {
  return () => {
    const vscode = createVscode();
    if (vscode === null) {
      return;
    }
    new EditService(toggleStatusBarItem, vscode).remove();
  };
};

export const toggleFunc = (toggleStatusBarItem: ToggleStatusBarItem) => {
  return () => {
    const vscode = createVscode();
    if (vscode === null) {
      return;
    }
    new EditService(toggleStatusBarItem, vscode).toggle();
  };
};
