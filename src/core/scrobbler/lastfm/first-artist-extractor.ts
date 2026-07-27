import { createXXHash3, type IHasher } from 'hash-wasm';

/** @internal Lazy-initialized XXH3_64 hasher instance. Fire-and-forget to avoid import-time crash. */
let hasher: IHasher | null = null;
createXXHash3()
	.then((h) => {
		hasher = h;
	})
	.catch(() => {
		/* xxhash3 wasm unavailable — extract() will skip allowlist checks */
	});

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
	const digest = instance.digest('binary') as Uint8Array;
	const view = new DataView(digest.buffer, digest.byteOffset, digest.byteLength);
	return view.getBigUint64(0, true);
}

export function extract(
	artistName: string,
	allowlist: Set<bigint>,
): string {
	if (!artistName) {
		return '';
	}

	if (hasher && allowlist.has(hashName(hasher, artistName.toLowerCase()))) {
		return artistName;
	}

	let earliestPos = -1;
	for (const sep of SEPARATORS) {
		const pos = artistName.indexOf(sep);
		if (pos !== -1 && (earliestPos === -1 || pos < earliestPos)) {
			earliestPos = pos;
		}
	}

	if (earliestPos === -1) {
		return artistName;
	}

	if (hasher) {
		for (let i = 1; i <= earliestPos; i++) {
			const prefix = artistName.substring(0, i);
			if (allowlist.has(hashName(hasher, prefix.toLowerCase()))) {
				return prefix;
			}
		}
	}

	return artistName.substring(0, earliestPos).trim();
}
