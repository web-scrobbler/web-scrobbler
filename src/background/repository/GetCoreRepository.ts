import { CoreRepository } from './core/CoreRepository';
import { CoreRepositoryData } from './core/CoreRepositoryData';
import { CoreRepositoryImpl } from './core/CoreRepositoryImpl';

import { createCoreStorage } from '@/background/storage2/StorageFactory';

export function getCoreRepository(): CoreRepository {
	return coreRepository;
}

function createCoreRepository(): CoreRepository {
	const coreStorage = createCoreStorage<CoreRepositoryData>();
	return new CoreRepositoryImpl(coreStorage);
}

const coreRepository = createCoreRepository();
