import type { FeatureModule } from '../core/features';
import { bilibiliFeature } from './bilibili/module';
import { musicFeature } from './music/module';
import { testFeature } from './test/module';

export const featureModules: FeatureModule[] = [
	musicFeature,
	bilibiliFeature,
	testFeature,
];
