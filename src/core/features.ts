import * as vscode from 'vscode';

export interface FeatureCommand {
	id: string;
	handler: () => void;
}

export interface FeatureModule {
	id: string;
	displayName: string;
	commands: FeatureCommand[];
}

export function registerFeatureModules(
	context: vscode.ExtensionContext,
	features: FeatureModule[],
): void {
	for (const feature of features) {
		for (const command of feature.commands) {
			const disposable = vscode.commands.registerCommand(command.id, command.handler);
			context.subscriptions.push(disposable);
		}
	}
}
