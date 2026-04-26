import type { FeatureDescriptor } from '@shared/protocol';

export const fallbackFeatures: FeatureDescriptor[] = [
	{
		id: 'music',
		title: 'Music',
		description: 'Keeps the current simple information message command behavior.',
		commandId: 'worktime-video.music.hello',
	},
	{
		id: 'bilibili',
		title: 'Bilibili',
		description: 'Keeps the current simple information message command behavior.',
		commandId: 'worktime-video.bilibili.hello',
	},
	{
		id: 'test',
		title: 'Test',
		description: 'Keeps the current simple information message command behavior.',
		commandId: 'worktime-video.test.hello',
	},
];
