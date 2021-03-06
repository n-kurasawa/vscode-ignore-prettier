# Ignore Prettier

**This is a development branch that is actively being worked on.**

---

Allows you to add and remove files from `.prettierignore`.

~~This is especially useful when you want to ignore a file temporarily.~~

If you just want to ignore it temporarily It may be more convenient to use the [Formatting Toggle](https://marketplace.visualstudio.com/items?itemName=tombonnike.vscode-status-bar-format-toggle).
Alternatively, VS Code provides Save Without Formatting.

## Installation

Install through VS Code extensions. Search for `nkurasawa.vscode-ignore-prettier`

[Visual Studio Code Market Place: Ignore Prettier](https://marketplace.visualstudio.com/items?itemName=nkurasawa.vscode-ignore-prettier)

## Usage

### Using Status Bar

Before click status bar, the following is required

```
1. Open the directory with vscode
2. Open the file you want to add or remove from `.prettierignore`
```

Toggle `.prettierignore`

```
Click the "Toggle Prettier" on the status bar.
```

#### If the file has not been added to .prettierignore.

The file will be added.  
If `.prettierignore` is not present, it will be created.

#### If the file has been added to .prettierignore.

The file will be removed.  
If `.prettierignore` is empty, it will be removed.

### Using Command Palette (CMD/CTRL + Shift + P)

Before running the command, the following is required

```
1. Open the directory with vscode
2. Open the file you want to add or remove from `.prettierignore`
```

Add to `.prettierignore`.

If `.prettierignore` is not present, it will be created.

```
CMD + Shift + P -> Ignore Prettier: Add
```

Remove from `.prettierignore`.

If `.prettierignore` is empty, it will be removed.

```
CMD + Shift + P -> Ignore Prettier: Remove
```

Toggle add and remove from `.prettierignore`.

```
CMD + Shift + P -> Ignore Prettier: Toggle
```

## Release Notes

### 1.0.0

- Initial release of vscode-ignore-prettier

### 1.0.1

- Update README

### 2.0.0

- Add Toggle Status Bar
