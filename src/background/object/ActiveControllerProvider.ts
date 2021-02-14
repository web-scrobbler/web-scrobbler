import type { Controller } from '@/background/object/controller';

export interface ActiveControllerProvider {
	getActiveController(): Controller;
}
