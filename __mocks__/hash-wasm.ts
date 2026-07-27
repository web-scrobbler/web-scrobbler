/**
 * Mock for hash-wasm (Vitest auto-mock).
 *
 * Provides mock createXXHash3() and xxhash3() functions for testing.
 * The mock hasher returns zero-filled 8-byte digests.
 */

interface MockHasher {
	init: () => MockHasher;
	update: (data: unknown) => MockHasher;
	digest: (outputType?: string) => string | Uint8Array;
	save: () => Uint8Array;
	load: (state: Uint8Array) => MockHasher;
	blockSize: number;
	digestSize: number;
}

function createMockHasher(): MockHasher {
	return {
		init(): MockHasher {
			return this;
		},
		update(): MockHasher {
			return this;
		},
		digest(outputType?: string): string | Uint8Array {
			const bytes = new Uint8Array(8);
			if (outputType === 'binary') {
				return bytes;
			}
			return '0000000000000000';
		},
		save: (): Uint8Array => new Uint8Array(8),
		load(): MockHasher {
			return this;
		},
		blockSize: 512,
		digestSize: 8,
	};
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export function createXXHash3(
	_seedLow?: number,
	_seedHigh?: number,
): Promise<MockHasher> {
	return Promise.resolve(createMockHasher());
}

export function xxhash3(
	_data: string | Buffer | Uint8Array | Uint16Array | Uint32Array,
	_seedLow?: number,
	_seedHigh?: number,
): Promise<string> {
	return Promise.resolve('0000000000000000');
}
/* eslint-enable @typescript-eslint/no-unused-vars */

export type { MockHasher as IHasher };
