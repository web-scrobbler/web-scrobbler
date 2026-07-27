import xxhash from 'xxhash-wasm';

/** @internal Lazy-initialized xxhash64 function. Fire-and-forget to avoid import-time crash. */
let h64Fn: ((input: string) => bigint) | null = null;
xxhash()
	.then(({ h64 }) => {
		h64Fn = h64;
	})
	.catch(() => {
		/* xxhash unavailable — extract() will skip allowlist checks */
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

export function extract(
	artistName: string,
	allowlist: Set<bigint>,
): string {
	if (!artistName) {
		return '';
	}

	if (h64Fn && allowlist.has(h64Fn(artistName.toLowerCase()))) {
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

	if (h64Fn) {
		for (let i = 1; i <= earliestPos; i++) {
			const prefix = artistName.substring(0, i);
			if (allowlist.has(h64Fn(prefix.toLowerCase()))) {
				return prefix;
			}
		}
	}

	return artistName.substring(0, earliestPos).trim();
}
