import type { WorktimeWebviewState } from '../../../shared/protocol';

import { fallbackFeatures } from '../features/catalog';

const vscodeApi =
	typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi<WorktimeWebviewState>() : undefined;

const defaultState: WorktimeWebviewState = {
	title: 'Worktime Video',
	description: 'Vue scaffold only. The existing command popup behavior is still untouched.',
	features: fallbackFeatures,
};

function readBodyState(): WorktimeWebviewState | undefined {
	const raw = document.body.dataset.initialState;
	if (!raw) {
		return undefined;
	}

	try {
		return JSON.parse(raw) as WorktimeWebviewState;
	} catch {
		return undefined;
	}
}

export function getInitialState(): WorktimeWebviewState {
	return vscodeApi?.getState() ?? readBodyState() ?? defaultState;
}

export function postMessage(message: unknown): void {
	if (vscodeApi) {
		vscodeApi.postMessage(message);
		return;
	}

	if (import.meta.env.DEV) {
		
		console.info('[webview mock message]', message);
	}
}
