/**
 * Mock for hash-wasm (Vitest auto-mock).
 *
 * Provides mock createXXHash3() and xxhash3() functions for testing.
 * The mock hasher returns zero-filled 8-byte digests.
 */

interface MockHasher {
	init: () => MockHasher;
	update: (_data: unknown) => MockHasher;
	digest: (outputType?: string) => string | Uint8Array;
	save: () => Uint8Array;
	load: (_state: Uint8Array) => MockHasher;
	blockSize: number;
	digestSize: number;
}

function createMockHasher(): MockHasher {
	return {
		init: function (): MockHasher {
			return this;
		},
		update: function (_data: unknown): MockHasher {
			return this;
		},
		digest: function (outputType?: string): string | Uint8Array {
			const bytes = new Uint8Array(8);
			if (outputType === 'binary') {
				return bytes;
			}
			return '0000000000000000';
		},
		save: (): Uint8Array => new Uint8Array(8),
		load: function (_state: Uint8Array): MockHasher {
			return this;
		},
		blockSize: 512,
		digestSize: 8,
	};
}

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

export type { MockHasher as IHasher };
