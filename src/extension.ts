import * as vscode from 'vscode';

import { registerFeatureModules } from './core/features';
import { featureModules } from './features';

export function activate(context: vscode.ExtensionContext): void {
	registerFeatureModules(context, featureModules);
}

export function deactivate(): void {}
