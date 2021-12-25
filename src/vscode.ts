import { StatusBarItem } from "vscode";

const enableText = "$(check) Toggle Prettier";
const disableText = "$(circle-slash) Toggle Prettier";

export class Vscode {
  constructor(private statusBarItem: StatusBarItem) {}

  getOpenedFilename(): string {
    // TODO impl
    return "";
  }
  writeFileName(filename: string): void {
    // TODO impl
  }
  disableStatusBarItemText(): void {
    this.statusBarItem.text = disableText;
  }

  enableStatusBarItemText(): void {
    this.statusBarItem.text = enableText;
  }
}
