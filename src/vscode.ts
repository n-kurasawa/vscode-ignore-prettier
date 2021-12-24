import { IVscodeRepository } from "./commands";
import { StatusBarItem } from "vscode";

const enableText = "$(check) Toggle Prettier";
const disableText = "$(circle-slash) Toggle Prettier";

export class VscodeRepository implements IVscodeRepository {
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
