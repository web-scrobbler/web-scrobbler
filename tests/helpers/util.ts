import { basename } from 'path';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...args: any) => any;

export function getFunctionName(func: AnyFunction): string {
	return func.name.replace(/^bound/, '');
}

export function getTestName(fileName: string): string {
	return basename(fileName).split('.')[0];
}
