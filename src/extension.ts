import * as vscode from 'vscode';

import { WorktimeWebviewPanel, WORKTIME_SIDEBAR_VIEW_ID } from './core/webview/panel';

export function activate(context: vscode.ExtensionContext): void {
	const provider = new WorktimeWebviewPanel(context);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(WORKTIME_SIDEBAR_VIEW_ID, provider, {
			webviewOptions: {
				retainContextWhenHidden: true,
			},
		}),
	);
}

export function deactivate(): void {}
