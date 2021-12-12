import { commands, ExtensionContext, window } from 'vscode';

export function activate(context: ExtensionContext) {
	console.log('vscode-prettierignore is activated.');

	let disposable = commands.registerCommand('prettierignore.add', () => {
		window.showInformationMessage('Hello World from Prettier Ignore!');
	});

	context.subscriptions.push(disposable);
}
