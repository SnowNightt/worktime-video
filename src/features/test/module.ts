import * as vscode from 'vscode';

import type { FeatureModule } from '../../core/features';

export const testFeature: FeatureModule = {
	id: 'test',
	displayName: 'Test Module',
	commands: [
		{
			id: 'worktime-video.test.hello',
			handler: () => {
				vscode.window.showInformationMessage('芜湖!');
			},
		},
	],
};
