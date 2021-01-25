import { basename } from 'path';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...args: any) => any;

export function getFunctionName(func: AnyFunction): string {
	return func.name.replace(/^bound/, '');
}

export function getObjectKeys<T>(obj: T): (keyof T)[] {
	return Object.keys(obj) as (keyof T)[];
}

export function describeModuleTest(
	filename: string,
	fn: (this: Mocha.Suite) => void
): Mocha.Suite {
	const title = basename(filename).split('.')[0];

	return describe(title, fn);
}
