import type { ExtensionToWebviewMessage } from '../../../shared/protocol';

import { postMessage } from './vscode';


type Listener = (message: ExtensionToWebviewMessage) => void;

class ExtensionBridge {
	private readonly listeners = new Set<Listener>();
	constructor() {
		window.addEventListener('message', (event: MessageEvent<ExtensionToWebviewMessage>) => {
			const message = event.data;
			this.listeners.forEach((listener) => listener(message));
		});
	}

	public subscribe(listener: Listener): () => void {
		
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	public ready(): void {
		
		postMessage({ type: 'ui/ready' });
	}

	public openCommand(commandId: string): void {
		
		postMessage({
			type: 'ui/open-command',
			commandId,
		});
	}
}

export const extensionBridge = new ExtensionBridge();
