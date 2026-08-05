import { createXXHash3, type IHasher } from 'hash-wasm';
import { debugLog } from '@/util/util';

/** @internal Lazy-init promise for XXH3_64 hasher. */
let hasherInit: Promise<IHasher | null> | null = null;

async function getHasher(): Promise<IHasher | null> {
	if (hasherInit) {
		return hasherInit;
	}
	hasherInit = createXXHash3().catch(() => {
		debugLog(
			'XXH3 WASM init failed, skipping allowlist checks',
			'warn',
		);
		return null;
	});
	return hasherInit;
}

const SEPARATORS: readonly string[] = [
	', ',
	' & ',
	' / ',
	' feat. ',
	' ft. ',
	' vs. ',
	' + ',
	' with ',
	' featuring ',
	' presents ',
	' pres. ',
	' prod. ',
	' x ',
	' • ',
	',',
];

/**
 * Compute XXH3_64 hash of a string, returning the result as a bigint.
 * Uses the synchronous IHasher API after async wasm initialisation.
 */
function hashName(instance: IHasher, name: string): bigint {
	instance.init();
	instance.update(name);
	const digest = instance.digest('binary');
	const bytes = digest instanceof Uint8Array ? digest : new Uint8Array(8);
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	return view.getBigUint64(0, true);
}

/**
 * Extract the first artist name from a multi-artist string using separator
 * detection, with an allowlist-based hasher for known multi-word artist names.
 *
 * When the allowlist is non-empty, the function first checks whether the full
 * artist name matches a known hash. If not, it finds the earliest separator
 * and checks each prefix against the allowlist. If no match is found, the
 * artist name is truncated at the earliest separator.
 *
 * Graceful degradation: if the XXH3 WASM module fails to initialise, the
 * allowlist checks are silently skipped and only separator-based extraction
 * is performed.
 *
 * @param artistName - Full artist name string to process
 * @param allowlist - Set of XXH3_64 hashes of known multi-word artist names
 * @returns Extracted first artist name, or empty string if input is falsy
 */
export async function extract(
	artistName: string,
	allowlist: Set<bigint>,
): Promise<string> {
	if (!artistName) {
		return '';
	}

	let hasher: IHasher | null = null;
	if (allowlist.size > 0) {
		hasher = await getHasher();
	}

	if (hasher && allowlist.has(hashName(hasher, artistName.toLowerCase()))) {
		return artistName;
	}

	// Collect candidate end positions: every separator start in the string.
	const candidateEnds = new Set<number>();
	for (const sep of SEPARATORS) {
		let from = 0;
		while (true) {
			const pos = artistName.indexOf(sep, from);
			if (pos === -1) {
				break;
			}
			candidateEnds.add(pos);
			from = pos + 1;
		}
	}

	if (candidateEnds.size === 0) {
		return artistName;
	}

	const earliestPos = Math.min(...candidateEnds);

	if (hasher) {
		let best: string | null = null;
		for (const pos of candidateEnds) {
			const prefix = artistName.substring(0, pos);
			if (allowlist.has(hashName(hasher, prefix.toLowerCase()))) {
				if (best === null || prefix.length > best.length) {
					best = prefix;
				}
			}
		}
		if (best !== null) {
			return best;
		}
	}

	return artistName.substring(0, earliestPos).trim();
}
