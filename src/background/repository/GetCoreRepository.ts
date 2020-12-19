import { CoreRepository } from './core/CoreRepository';
import { CoreRepositoryImpl } from './core/CoreRepositoryImpl';

import { createCoreStorage } from '@/background/storage2/StorageFactory';

export function getCoreRepository(): CoreRepository {
	return coreRepository;
}

const coreRepository = new CoreRepositoryImpl(createCoreStorage());
