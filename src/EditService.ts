import { EOL } from "os";
import { removeFilename } from "./removeFilename";
import { ToggleStatusBarItem } from "./ToggleStatusBarItem";
import { Vscode } from "./vscode";

export class EditService {
  constructor(
    private toggleStatusBarItem: ToggleStatusBarItem,
    private vscode: Vscode
  ) {}

  async add() {
    const filename = this.vscode.getOpenedFilename();
    const uri = this.vscode.getPrettierignoreUri();
    let currentValue = "";
    if (await this.vscode.exists(uri)) {
      const readData = await this.vscode.readFile(uri);
      currentValue = readData.trimEnd() + EOL;
    }
    const newValue = currentValue + filename + EOL;
    this.vscode.writeFile(uri, newValue);
    this.toggleStatusBarItem.disableStatusBarItemText();
  }

  async remove() {
    const filename = this.vscode.getOpenedFilename();
    const uri = this.vscode.getPrettierignoreUri();
    let currentValue = "";
    if (await this.vscode.exists(uri)) {
      const readData = await this.vscode.readFile(uri);
      currentValue = readData.trimEnd() + EOL;
    }
    const newValue = removeFilename(currentValue, filename);
    if (newValue.trim() === "") {
      this.vscode.deleteFile(uri);
    } else {
      this.vscode.writeFile(uri, newValue);
    }
    this.toggleStatusBarItem.enableStatusBarItemText();
  }

  async toggle() {
    const filename = this.vscode.getOpenedFilename();
    const uri = this.vscode.getPrettierignoreUri();
    let currentValue = "";
    if (await this.vscode.exists(uri)) {
      const readData = await this.vscode.readFile(uri);
      currentValue = readData.trimEnd() + EOL;
    }
    let newValue = "";
    if (currentValue.includes(filename)) {
      newValue = removeFilename(currentValue, filename);
      this.toggleStatusBarItem.enableStatusBarItemText();
    } else {
      newValue = currentValue + filename + EOL;
      this.toggleStatusBarItem.disableStatusBarItemText();
    }
    if (newValue.trim() === "") {
      this.vscode.deleteFile(uri);
    } else {
      this.vscode.writeFile(uri, newValue);
    }
  }
}
