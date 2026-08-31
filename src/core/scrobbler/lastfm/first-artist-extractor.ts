/**
 * Extracts the first artist from a multi-artist name.
 *
 * When the whole artist name (lowercased) is present in the allowlist it is
 * returned unchanged. Otherwise the name is split on a fixed set of
 * separators; the earliest split position yields the truncated first artist,
 * unless a longer prefix ending at a later split position is allowlisted.
 */
import { createXXHash3, type IHasher } from 'hash-wasm';
import { debugLog } from '@/util/util';
import separatorsData from './separators.json';

/**
 * Separators that delimit a first artist from the rest of a name.
 * Each occurrence of a separator marks a candidate split position.
 *
 * Single source of truth shared with the Python allowlist generator:
 * `separators.json` also carries the substrings the generator filters on,
 * with the invariant that every separator is one of those substrings.
 */
export const SEPARATORS = separatorsData.separators;

/** Cached lazy initialisation of the shared XXH3_64 hasher. */
let hasherInit: Promise<IHasher | null> | null = null;

/**
 * Return the shared XXH3_64 hasher, initialising it once on first use.
 *
 * Fails gracefully: when the WASM module cannot be initialised, a warning is
 * logged and `null` is returned so callers degrade to plain truncation.
 *
 * @returns The hasher instance, or `null` when WASM initialisation failed
 */
function getHasher(): Promise<IHasher | null> {
	if (hasherInit === null) {
		hasherInit = createXXHash3().catch(() => {
			debugLog('Failed to initialise the XXH3_64 hasher', 'warn');
			return null;
		});
	}
	return hasherInit;
}

/**
 * Compute the XXH3_64 digest of a name as a little-endian unsigned 64-bit
 * bigint using the shared hasher instance.
 *
 * @param instance - Shared hasher instance
 * @param name - Name to hash
 * @returns 64-bit digest interpreted as a little-endian bigint
 */
function hashName(instance: IHasher, name: string): bigint {
	instance.init();
	instance.update(name);
	const bytes = instance.digest('binary');
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	return view.getBigUint64(0, true);
}

/**
 * Extract the first artist from a multi-artist name.
 *
 * When the whole name (lowercased) is allowlisted it is returned unchanged.
 * Otherwise the name is scanned for every separator and all split positions
 * are collected; the earliest split position is used to truncate the name,
 * unless a longer prefix ending at a later split position is allowlisted, in
 * which case that longer prefix is returned.
 *
 * @param artistName - Artist name to process
 * @param allowlist - Set of XXH3_64 digests of known full artist names
 * @returns The first artist, or the full name when no separator applies
 */
export async function extract(
	artistName: string,
	allowlist: Set<bigint>,
): Promise<string> {
	if (!artistName) {
		return '';
	}

	// Only initialise the hasher when an allowlist can actually be consulted.
	let hasher: IHasher | null = null;
	if (allowlist.size > 0) {
		hasher = await getHasher();
	}

	// Whole-name match: the name (as-is, ignoring case) is allowlisted.
	if (hasher && allowlist.has(hashName(hasher, artistName.toLowerCase()))) {
		return artistName;
	}

	// Collect every candidate split position for all separators.
	const candidates = new Set<number>();
	for (const sep of SEPARATORS) {
		let pos = artistName.indexOf(sep);
		while (pos !== -1) {
			candidates.add(pos);
			pos = artistName.indexOf(sep, pos + sep.length);
		}
	}

	if (candidates.size === 0) {
		return artistName;
	}

	const earliestPos = Math.min(...candidates);

	if (hasher) {
		// Prefer the longest prefix ending at a split position that is
		// allowlisted, so allowlisted names containing internal separators
		// are preserved.
		let longest: string | null = null;
		for (const pos of candidates) {
			const prefix = artistName.substring(0, pos);
			if (allowlist.has(hashName(hasher, prefix.toLowerCase()))) {
				if (longest === null || prefix.length > longest.length) {
					longest = prefix;
				}
			}
		}
		if (longest !== null) {
			return longest;
		}
	}

	return artistName.substring(0, earliestPos).trim();
}
