/**
 * Mock for xxhash-wasm (Vitest auto-mock).
 * Provides a factory that returns hasher functions for testing.
 *
 * @returns Mock hasher API
 */
export default async function xxhash(): Promise<{
	h64(input: string): bigint;
	h64ToString(input: string): string;
}> {
	return {
		h64: (_input: string): bigint => 0n,
		h64ToString: (_input: string): string => '0000000000000000',
	};
}
