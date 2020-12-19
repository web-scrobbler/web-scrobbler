import { CustomUrlPatternsImpl } from './custom-patterns/CustomUrlPatternsImpl';
import { CustomUrlPatterns } from './custom-patterns/CustomUrlPatterns';

import { createCustomUrlPatternsStorage } from '../storage2/StorageFactory';

export function getCustomUrlPatterns(): CustomUrlPatterns {
	return customUrlPatterns;
}

const customUrlPatterns = new CustomUrlPatternsImpl(
	createCustomUrlPatternsStorage()
);
