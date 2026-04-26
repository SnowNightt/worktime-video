export const FEATURE_IDS = ['music', 'bilibili', 'test'] as const;

export type FeatureId = (typeof FEATURE_IDS)[number];


export interface FeatureDescriptor {
	id: FeatureId;
	title: string;
	description: string;
	commandId: string;
}


export interface WorktimeWebviewState {
	title: string;
	description: string;
	features: FeatureDescriptor[];
}


export interface WebviewReadyMessage {
	type: 'ui/ready';
}


export interface OpenCommandMessage {
	type: 'ui/open-command';
	commandId: string;
}


export type WebviewToExtensionMessage = WebviewReadyMessage | OpenCommandMessage;


export interface InitStateMessage {
	type: 'host/init-state';
	payload: WorktimeWebviewState;
}


export interface HostErrorMessage {
	type: 'host/error';
	message: string;
}


export type ExtensionToWebviewMessage = InitStateMessage | HostErrorMessage;
