import browser from 'webextension-polyfill';
import { debugLog } from '@/util/util';

/** Cache of loaded artist hashes. Null means not yet loaded. */
let artistAllowlistCache: Set<bigint> | null = null;

/** Promise used for concurrency deduplication during loading. */
let loadingPromise: Promise<void> | null = null;

/**
 * Load the artist allowlist from the bundled binary hash file.
 * The file is a flat sequence of 64-bit little-endian bigint values.
 *
 * @returns Set of 64-bit artist name hashes
 */
export async function loadArtistAllowlist(): Promise<Set<bigint>> {
	const url = browser.runtime.getURL(
		'static-data/musicbrainz_artist_hashes.bin',
	);

	let response: Response;
	try {
		response = await fetch(url);
	} catch (err) {
		debugLog(`Failed to fetch artist allowlist: ${err}`, 'error');
		return new Set();
	}

	let buffer: ArrayBuffer;
	try {
		buffer = await response.arrayBuffer();
	} catch (err) {
		debugLog(`Failed to read artist allowlist buffer: ${err}`, 'error');
		return new Set();
	}

	const result = new Set<bigint>();
	const view = new DataView(buffer);
	const count = view.byteLength / 8;

	try {
		for (let i = 0; i < count; i++) {
			result.add(view.getBigUint64(i * 8, true));
		}
	} catch (err) {
		debugLog(`Failed to parse artist allowlist: ${err}`, 'error');
		return new Set();
	}

	return result;
}

/**
 * Get the artist allowlist, loading it lazily if not yet cached.
 * Uses a concurrency guard to prevent parallel fetches.
 *
 * @returns Set of 64-bit artist name hashes
 */
export async function getArtistAllowlist(): Promise<Set<bigint>> {
	if (artistAllowlistCache !== null) {
		return artistAllowlistCache;
	}

	if (loadingPromise === null) {
		loadingPromise = loadArtistAllowlist().then((result) => {
			artistAllowlistCache = result;
		});
	}

	await loadingPromise;
	return artistAllowlistCache ?? new Set();
}
