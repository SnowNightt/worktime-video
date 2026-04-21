import * as vscode from 'vscode';

import type { FeatureModule } from '../../core/features';

export const musicFeature: FeatureModule = {
	id: 'music',
	displayName: '音乐播放器',
	commands: [
		{
			id: 'worktime-video.music.hello',
			handler: () => {
				vscode.window.showInformationMessage('啊哈哈!');
			},
		},
	],
};
