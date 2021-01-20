import md5 from 'blueimp-md5';

import {
	generateId,
	IdGenerator,
} from '@/background/util/id-generator/IdGenerator';

export type IdGeneratorFunction = () => IdGenerator;

export function createIdGenerator(seed: string[]): IdGeneratorFunction {
	return () => generateId(seed, md5);
}
