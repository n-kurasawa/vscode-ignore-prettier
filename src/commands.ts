import { StatusBarItem } from "vscode";
import { EditService } from "./EditService";

export const addFunc = (statusBarItem: StatusBarItem) => {
  return () => {
    try {
      new EditService(statusBarItem).add();
    } catch (e) {}
  };
};

export const removeFunc = (statusBarItem: StatusBarItem) => {
  return () => {
    try {
      new EditService(statusBarItem).remove();
    } catch (e) {}
  };
};

export const toggleFunc = (statusBarItem: StatusBarItem) => {
  return () => {
    try {
      new EditService(statusBarItem).toggle();
    } catch (e) {}
  };
};
