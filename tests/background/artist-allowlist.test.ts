/**
 * Tests for artist-allowlist module.
 */

import { expect, describe, it, vi, beforeEach } from 'vitest';

vi.mock('webextension-polyfill', () => ({
	default: {
		runtime: {
			getURL: (path: string): string => path,
		},
	},
}));

const TEST_BUFFER = (() => {
	const bytes = new Uint8Array(16);
	const view = new DataView(bytes.buffer);
	view.setBigUint64(0, 42n, true);
	view.setBigUint64(8, 100n, true);
	return bytes.buffer as ArrayBuffer;
})();

/**
 * Create a fetch mock that resolves with a given ArrayBuffer.
 *
 * @param buffer - ArrayBuffer to return
 * @returns Mocked fetch function
 */
function mockFetchResolve(buffer: ArrayBuffer) {
	return vi.fn().mockResolvedValue({
		arrayBuffer: () => Promise.resolve(buffer),
	});
}

/**
 * Mock fetch to reject with a network error.
 *
 * @returns Mocked fetch function
 */
function mockFetchReject() {
	return vi.fn().mockRejectedValue(new Error('Network error'));
}

/**
 * Mock fetch to reject arrayBuffer().
 *
 * @returns Mocked fetch function
 */
function mockFetchBufferReject() {
	return vi.fn().mockResolvedValue({
		arrayBuffer: () => Promise.reject(new Error('Buffer error')),
	});
}

describe('artist-allowlist', () => {
	beforeEach(() => {
		vi.resetModules();
		vi.unstubAllGlobals();
	});

	it('should load hashes from binary buffer', async () => {
		vi.stubGlobal('fetch', mockFetchResolve(TEST_BUFFER));

		const { getArtistAllowlist } = await import(
			'@/core/scrobbler/lastfm/artist-allowlist'
		);

		const result = await getArtistAllowlist();

		expect(result).toBeInstanceOf(Set);
		expect(result.size).to.be.equal(2);
		expect(result.has(42n)).to.be.equal(true);
		expect(result.has(100n)).to.be.equal(true);
	});

	it('should return cached result on second call', async () => {
		const fetchMock = mockFetchResolve(TEST_BUFFER);
		vi.stubGlobal('fetch', fetchMock);

		const { getArtistAllowlist } = await import(
			'@/core/scrobbler/lastfm/artist-allowlist'
		);

		const result1 = await getArtistAllowlist();
		const result2 = await getArtistAllowlist();

		expect(result2).to.be.equal(result1);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('should deduplicate concurrent calls', async () => {
		let resolveFetch: (value: unknown) => void;
		const fetchPromise = new Promise((resolve) => {
			resolveFetch = resolve;
		});

		const fetchMock = vi.fn().mockReturnValue(fetchPromise);
		vi.stubGlobal('fetch', fetchMock);

		const { getArtistAllowlist } = await import(
			'@/core/scrobbler/lastfm/artist-allowlist'
		);

		// Fire multiple concurrent calls before the fetch resolves
		const calls = [
			getArtistAllowlist(),
			getArtistAllowlist(),
			getArtistAllowlist(),
		];

		// Let the fetch complete
		resolveFetch!({
			arrayBuffer: () => Promise.resolve(TEST_BUFFER),
		});

		const results = await Promise.all(calls);

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(results[0]).to.be.equal(results[1]);
		expect(results[1]).to.be.equal(results[2]);
	});

	it('should return empty set when fetch fails', async () => {
		vi.stubGlobal('fetch', mockFetchReject());

		const { getArtistAllowlist } = await import(
			'@/core/scrobbler/lastfm/artist-allowlist'
		);

		const result = await getArtistAllowlist();

		expect(result).toBeInstanceOf(Set);
		expect(result.size).to.be.equal(0);
	});

	it('should return empty set when arrayBuffer fails', async () => {
		vi.stubGlobal('fetch', mockFetchBufferReject());

		const { getArtistAllowlist } = await import(
			'@/core/scrobbler/lastfm/artist-allowlist'
		);

		const result = await getArtistAllowlist();

		expect(result).toBeInstanceOf(Set);
		expect(result.size).to.be.equal(0);
	});

	it('should return empty set for empty buffer', async () => {
		vi.stubGlobal('fetch', mockFetchResolve(new ArrayBuffer(0)));

		const { getArtistAllowlist } = await import(
			'@/core/scrobbler/lastfm/artist-allowlist'
		);

		const result = await getArtistAllowlist();

		expect(result).toBeInstanceOf(Set);
		expect(result.size).to.be.equal(0);
	});
});
