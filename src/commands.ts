import { Vscode } from "./vscode";

export const addFunc = (vscode: Vscode) => {
  return () => {
    const filename = vscode.getOpenedFilename();
    if (filename === "") {
      return;
    }
    vscode.addFilename(filename);
  };
};

export const removeFunc = (vscode: Vscode) => {
  return () => {
    const filename = vscode.getOpenedFilename();
    if (filename === "") {
      return;
    }
    vscode.removeFilename(filename);
  };
};

export const toggleFunc = (vscode: Vscode) => {
  return () => {
    const filename = vscode.getOpenedFilename();
    if (filename === "") {
      return;
    }
    vscode.toggleFilename(filename);
  };
};
