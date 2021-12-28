import { StatusBarItem } from "vscode";
import { EditService } from "./EditService";
import { ToggleStatusBarItem } from "./ToggleStatusBarItem";

export const addFunc = (toggleStatusBarItem: ToggleStatusBarItem) => {
  return () => {
    try {
      new EditService(toggleStatusBarItem).add();
    } catch (e) {}
  };
};

export const removeFunc = (toggleStatusBarItem: ToggleStatusBarItem) => {
  return () => {
    try {
      new EditService(toggleStatusBarItem).remove();
    } catch (e) {}
  };
};

export const toggleFunc = (toggleStatusBarItem: ToggleStatusBarItem) => {
  return () => {
    try {
      new EditService(toggleStatusBarItem).toggle();
    } catch (e) {}
  };
};
