/**
 * Mock for hash-wasm (Vitest auto-mock).
 *
 * Provides mock createXXHash3() and xxhash3() functions for testing.
 * The mock hasher accumulates update() input and computes a deterministic
 * FNV-1a 64-bit digest, so different inputs produce different hashes.
 */

const FNV_OFFSET_BASIS = 0xcbf29ce484222325n;
const FNV_PRIME = 0x100000001b3n;
const MASK_64 = 0xffffffffffffffffn;

function fnv1a64(input: string): bigint {
	let hash = FNV_OFFSET_BASIS;
	for (let i = 0; i < input.length; i++) {
		hash ^= BigInt(input.charCodeAt(i));
		hash = (hash * FNV_PRIME) & MASK_64;
	}
	return hash;
}

function hashToBytes(hash: bigint): Uint8Array {
	const bytes = new Uint8Array(8);
	const view = new DataView(bytes.buffer);
	view.setBigUint64(0, hash, true);
	return bytes;
}

function hashToHex(hash: bigint): string {
	return hash.toString(16).padStart(16, '0');
}

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
	let input = '';

	return {
		init(): MockHasher {
			input = '';
			return this;
		},
		update(data: unknown): MockHasher {
			input += String(data);
			return this;
		},
		digest(outputType?: string): string | Uint8Array {
			const hash = fnv1a64(input);
			if (outputType === 'binary') {
				return hashToBytes(hash);
			}
			return hashToHex(hash);
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
