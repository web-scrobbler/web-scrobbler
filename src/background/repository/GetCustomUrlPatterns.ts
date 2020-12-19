import { CustomUrlPatternsImpl } from './custom-patterns/CustomUrlPatternsImpl';
import { CustomUrlPatterns } from './custom-patterns/CustomUrlPatterns';
import { CustomUrlPatternsData } from './custom-patterns/CustomUrlPatternsData';

import { createCustomUrlPatternsStorage } from '../storage2/StorageFactory';

export function getCustomUrlPatterns(): CustomUrlPatterns {
	return customUrlPatterns;
}

const customUrlPatterns = createCustomUrlPatterns();

function createCustomUrlPatterns() {
	const patternsStorage = createCustomUrlPatternsStorage<
		CustomUrlPatternsData
	>();
	return new CustomUrlPatternsImpl(patternsStorage);
}
