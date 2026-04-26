declare module '*.vue' {
	import type { DefineComponent } from 'vue';

	const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>;
	export default component;
}

interface VsCodeApi<State> {
	getState(): State | undefined;
	postMessage(message: unknown): void;
	setState(state: State): State;
}

declare function acquireVsCodeApi<State = unknown>(): VsCodeApi<State>;
