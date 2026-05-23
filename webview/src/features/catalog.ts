import type { FeatureDescriptor } from '@shared/protocol';

export const fallbackFeatures: FeatureDescriptor[] = [
	{
		id: 'music',
		title: 'Music',
		description: 'Music playback inside the webview.',
	},
	{
		id: 'bilibili',
		title: 'Bilibili',
		description: 'Bilibili content inside the webview.',
	},
	{
		id: 'test',
		title: 'Test',
		description: 'Test area inside the webview.',
	},
];
