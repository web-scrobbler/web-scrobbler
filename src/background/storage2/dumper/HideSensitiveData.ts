import { hideObjectValue } from '@/background/util/util';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ReplacerFunction = (this: any, key: string, value: any) => any;

export function createHideSensitiveDataFunction(
	sensitiveProperties?: string[]
): ReplacerFunction {
	if (sensitiveProperties && sensitiveProperties.length > 0) {
		return (key: string, value: string) => {
			if (sensitiveProperties.includes(key)) {
				return hideObjectValue(value);
			}
			return value;
		};
	}

	return null;
}
