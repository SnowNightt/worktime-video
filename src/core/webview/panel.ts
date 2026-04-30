import * as vscode from 'vscode';

import {
	type ExtensionToWebviewMessage,
	type FeatureDescriptor,
	type WebviewToExtensionMessage,
	type WorktimeWebviewState,
} from '../../../shared/protocol';
import { getWebviewHtml } from './html';

const DEFAULT_STATE: WorktimeWebviewState = {
	title: 'Worktime Video',
	description: 'Vue scaffold for future work. Existing commands still use simple information messages.',
	features: [
		{
			id: 'music',
			title: 'Music',
			description: 'Currently still handled by the extension command popup.',
			commandId: 'worktime-video.music.hello',
		},
		{
			id: 'bilibili',
			title: 'Bilibili',
			description: 'Currently still handled by the extension command popup.',
			commandId: 'worktime-video.bilibili.hello',
		},
		{
			id: 'test',
			title: 'Test',
			description: 'Currently still handled by the extension command popup.',
			commandId: 'worktime-video.test.hello',
		},
	],
};

export const WORKTIME_SIDEBAR_VIEW_ID = 'worktime-video.sidebarView';

function escapeInitialState(state: WorktimeWebviewState): string {
	return JSON.stringify(state)
		.replaceAll('&', '&amp;')
		.replaceAll("'", '&#39;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;');
}

export class WorktimeWebviewPanel implements vscode.WebviewViewProvider {
	private readonly state: WorktimeWebviewState;
	private view: vscode.WebviewView | undefined;

	public constructor(private readonly context: vscode.ExtensionContext) {
		this.state = DEFAULT_STATE;
	}

	public async resolveWebviewView(webviewView: vscode.WebviewView): Promise<void> {
		this.view = webviewView;
		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [
				vscode.Uri.joinPath(this.context.extensionUri, 'webview', 'dist'),
				vscode.Uri.joinPath(this.context.extensionUri, 'webview', 'src', 'assets'),
			],
		};
		webviewView.webview.html = await getWebviewHtml(
			webviewView.webview,
			this.context.extensionUri,
			escapeInitialState(this.state),
			{
				extensionMode: this.context.extensionMode,
			},
		);

		webviewView.onDidDispose(() => {
			if (this.view === webviewView) {
				this.view = undefined;
			}
		});

		webviewView.webview.onDidReceiveMessage((message: WebviewToExtensionMessage) => {
			void this.handleMessage(message);
		});
	}

	public async postMessage(message: ExtensionToWebviewMessage): Promise<boolean> {
		return this.view?.webview.postMessage(message) ?? false;
	}

	private async handleMessage(message: WebviewToExtensionMessage): Promise<void> {
		if (message.type === 'ui/ready') {
			await this.postMessage({
				type: 'host/init-state',
				payload: this.state,
			});
			return;
		}

		if (message.type === 'ui/open-command') {
			await vscode.commands.executeCommand(message.commandId);
		}
	}
}

export function getDefaultWebviewFeatures(): FeatureDescriptor[] {
	return DEFAULT_STATE.features;
}
