/**
 * Integration test proving the REAL hash-wasm library + REAL
 * musicbrainz_artist_hashes.bin data pipeline works end to end.
 *
 * This validates the root cause of a production bug: the extension's WASM
 * was CSP-blocked, not the data. No mocks are used — the actual WASM module
 * and the actual bundled hash file are exercised.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import { createXXHash3 } from 'hash-wasm';
import { extract } from '@/core/scrobbler/lastfm/first-artist-extractor';

/** Expected XXH3_64 of 'tyler, the creator' (lowercase, seed 0). */
const TYLER_HASH = BigInt('0xd007c5b82458cb43');

/** Expected number of hashes in the bundled .bin file. */
const EXPECTED_HASH_COUNT = 124571;

/**
 * Load the bundled artist hash file from disk and parse it into a Set of
 * little-endian u64 bigints, mirroring loadArtistAllowlist().
 *
 * @returns Set of 64-bit artist name hashes
 */
function loadAllowlistFromDisk(): Set<bigint> {
	const binUrl = new URL(
		'../../src/static-data/musicbrainz_artist_hashes.bin',
		import.meta.url,
	);
	const bytes = readFileSync(fileURLToPath(binUrl));
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const result = new Set<bigint>();
	for (let i = 0; i < view.byteLength / 8; i++) {
		result.add(view.getBigUint64(i * 8, true));
	}
	return result;
}

/**
 * Compute the XXH3_64 hash of a string using the real hash-wasm WASM module,
 * returning the result as a bigint (little-endian byte order), matching the
 * extractor's internal hashName() conversion.
 *
 * @param name - String to hash
 * @returns 64-bit hash as a bigint
 */
async function hashName(name: string): Promise<bigint> {
	const hasher = await createXXHash3();
	hasher.init();
	hasher.update(name);
	const digest = hasher.digest('binary');
	const bytes = digest instanceof Uint8Array ? digest : new Uint8Array(8);
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	return view.getBigUint64(0, true);
}

describe('first-artist-extractor with real hash-wasm and real .bin data', () => {
	const allowlist = loadAllowlistFromDisk();

	it('should load the full bundled allowlist from disk', () => {
		expect(allowlist).toBeInstanceOf(Set);
		expect(allowlist.size).to.be.equal(EXPECTED_HASH_COUNT);
	});

	it('should compute the real XXH3_64 of "tyler, the creator" and find it in the allowlist', async () => {
		const digest = await hashName('tyler, the creator');
		expect(digest).to.be.equal(TYLER_HASH);
		expect(allowlist.has(digest)).to.be.equal(true);
	});

	it('should return the full allowlisted name without truncation', async () => {
		const result = await extract('Tyler, The Creator', allowlist);
		expect(result).to.be.equal('Tyler, The Creator');
	});

	it('should still truncate non-allowlisted multi-artist names', async () => {
		const result = await extract('Artist1, Artist2', allowlist);
		expect(result).to.be.equal('Artist1');
	});
});
