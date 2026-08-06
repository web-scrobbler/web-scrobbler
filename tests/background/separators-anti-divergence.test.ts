import { describe, it, expect } from 'vitest';

import { SEPARATORS } from '@/core/scrobbler/lastfm/first-artist-extractor';
import separatorsData from '@/core/scrobbler/lastfm/separators.json';

/**
 * Anti-divergence guards between the TypeScript extractor and the Python
 * allowlist generator, both of which must agree on the set of multi-artist
 * separators. The generator only admits names carrying a known substring, so
 * every separator used by the extractor has to be one of those substrings —
 * otherwise a valid multi-artist name never reaches the allowlist and gets
 * truncated by the extractor's fallback.
 *
 * These tests are the RED state of the fix: the `separators ⊆ substrings`
 * invariant does not hold yet and the corresponding assertions fail.
 */
describe('separators anti-divergence', () => {
	describe('a. TS SEPARATORS == JSON separators', () => {
		it('should keep the TS SEPARATORS list identical to the JSON separators list', () => {
			expect(SEPARATORS).to.deep.equal(separatorsData.separators);
		});
	});

	describe('b. JSON separators ⊆ substrings', () => {
		it('should keep every JSON separator present in the flattened substrings', () => {
			const substrings = Object.values(separatorsData.substrings).flat();
			for (const separator of separatorsData.separators) {
				expect(substrings, `missing "${separator}" in substrings`).to.include(
					separator,
				);
			}
		});
	});

	describe('c. TS SEPARATORS ⊆ substrings', () => {
		it('should keep every TS separator present in the flattened substrings', () => {
			const substrings = Object.values(separatorsData.substrings).flat();
			for (const separator of SEPARATORS) {
				expect(substrings, `missing "${separator}" in substrings`).to.include(
					separator,
				);
			}
		});
	});
});
