import * as vscode from 'vscode';

import type { FeatureModule } from '../../core/features';

export const bilibiliFeature: FeatureModule = {
	id: 'bilibili',
	displayName: 'Bilibili',
	commands: [
		{
			id: 'worktime-video.bilibili.hello',
			handler: () => {
				vscode.window.showInformationMessage('不赖!');
			},
		},
	],
};
