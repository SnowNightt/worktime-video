import * as vscode from 'vscode';

import { registerFeatureModules } from './core/features';
import { WorktimeWebviewPanel, WORKTIME_SIDEBAR_VIEW_ID } from './core/webview/panel';
import { featureModules } from './features';

export function activate(context: vscode.ExtensionContext): void {
	registerFeatureModules(context, featureModules);

	const provider = new WorktimeWebviewPanel(context);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(WORKTIME_SIDEBAR_VIEW_ID, provider),
	);
}

export function deactivate(): void {}
