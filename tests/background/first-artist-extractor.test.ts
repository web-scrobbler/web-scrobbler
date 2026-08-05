/**
 * Tests for first-artist-extractor and LastFmScrobbler.applyFilter integration.
 */

import { describe, it, expect, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Hoisted mocks (evaluated before imports)
// ---------------------------------------------------------------------------

vi.mock('hash-wasm');

vi.mock('webextension-polyfill', () => {
	class StorageAreaStub {
		private data: Record<string, unknown> = {};

		get() {
			return Promise.resolve({ ...this.data });
		}

		set(data: Record<string, unknown>) {
			Object.assign(this.data, data);
			return Promise.resolve();
		}

		remove(key: string) {
			delete this.data[key];
			return Promise.resolve();
		}

		clear() {
			this.data = {};
			return Promise.resolve();
		}
	}
	return {
		default: {
			storage: {
				local: new StorageAreaStub(),
				sync: new StorageAreaStub(),
			},
			runtime: {
				getURL: (path: string): string => path,
			},
		},
	};
});

vi.mock('@/util/communication', () => ({
	backgroundListener: vi.fn(() => vi.fn()),
	setupBackgroundListeners: vi.fn(),
	sendBackgroundMessage: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------

import { extract } from '@/core/scrobbler/lastfm/first-artist-extractor';
import { BaseSong } from '@/core/object/song';
import type { ParsedSongData, ProcessedSongData } from '@/core/object/song';
import type { ConnectorMeta } from '@/core/connectors';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Compute the deterministic XXH3_64 digest (as a bigint) of a string using the
 * mocked hash-wasm module, matching the extractor's internal hashing.
 */
async function hashOf(name: string): Promise<bigint> {
	const { createXXHash3 } = await import('hash-wasm');
	const h = await createXXHash3();
	h.init();
	h.update(name);
	const bytes = h.digest('binary') as Uint8Array;
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	return view.getBigUint64(0, true);
}

// ---------------------------------------------------------------------------
// Mock song class for applyFilter tests
// ---------------------------------------------------------------------------

class MockSong extends BaseSong {
	public parsed: ParsedSongData;
	public processed: ProcessedSongData = {};
	public noRegex: ProcessedSongData = {};
	public flags = {} as Record<string, never>;
	public metadata = { startTimestamp: 0, label: '' };
	public connector = {
		id: 'test',
		label: 'Test',
		matches: [],
		js: 'test.js',
	} as ConnectorMeta;

	constructor(
		artist: string | null | undefined,
		albumArtist: string | null | undefined,
	) {
		super();
		this.parsed = {
			artist: artist ?? null,
			albumArtist: albumArtist ?? null,
			track: null,
			album: null,
			duration: null,
		};
		this.processed = { ...this.parsed };
	}

	resetInfo(): void {
		/* no-op */
	}

	resetData(): void {
		/* no-op */
	}
}

// ---------------------------------------------------------------------------
// Tests: extract()
// ---------------------------------------------------------------------------

describe('extract', () => {
	const emptySet = new Set<bigint>();

	it('should return the full artist name when allowlist hash matches', async () => {
		const allowlist = new Set([await hashOf('tyler, the creator')]);
		const result = await extract('Tyler, The Creator', allowlist);
		expect(result).to.equal('Tyler, The Creator');
	});

	it('should return empty string for falsy input', async () => {
		expect(await extract('', emptySet)).to.equal('');
	});

	it('should return first artist for comma-separated input', async () => {
		const result = await extract('Artist1, Artist2, Artist3', emptySet);
		expect(result).to.equal('Artist1');
	});

	it('should return full name when no separator present', async () => {
		const result = await extract('Single Artist', emptySet);
		expect(result).to.equal('Single Artist');
	});

	it('should return first artist for "feat." separated input', async () => {
		const result = await extract('Artist1 feat. Artist2', emptySet);
		expect(result).to.equal('Artist1');
	});

	it('should return first artist for " & " separated input', async () => {
		const result = await extract('Artist1 & Artist2', emptySet);
		expect(result).to.equal('Artist1');
	});

	it('should return first artist for "vs." separated input', async () => {
		const result = await extract('Artist1 vs. Artist2', emptySet);
		expect(result).to.equal('Artist1');
	});

	it('should return first artist for "x" separated input', async () => {
		const result = await extract('Artist1 x Artist2', emptySet);
		expect(result).to.equal('Artist1');
	});

	it('should return first artist for "•" separated input', async () => {
		const result = await extract('Artist1 • Artist2', emptySet);
		expect(result).to.equal('Artist1');
	});

	it('should handle comma without space separator', async () => {
		const result = await extract('A,B', emptySet);
		expect(result).to.equal('A');
	});

	it('should handle non-ASCII characters', async () => {
		const result = await extract('ファイターズ, 何か', emptySet);
		expect(result).to.equal('ファイターズ');
	});

	it('should return full name when allowlist matches (full-name hash path)', async () => {
		const allowlist = new Set([await hashOf('earth, wind & fire')]);
		const result = await extract('Earth, Wind & Fire', allowlist);
		expect(result).to.equal('Earth, Wind & Fire');
	});

	it('should return the matched prefix via progressive prefix matching when prefix is in allowlist but full string is not', async () => {
		const allowlist = new Set([await hashOf('earth')]);
		const result = await extract('Earth, Wind & Fire', allowlist);
		expect(result).to.equal('Earth');
	});
});

// ---------------------------------------------------------------------------
// Tests: LastFmScrobbler.applyFilter()
// ---------------------------------------------------------------------------

describe('LastFmScrobbler.applyFilter', () => {
	it('should normalize "Various Artists" in album artist', async () => {
		const { default: LastFmScrobbler } = await import(
			'@/core/scrobbler/lastfm/lastfm-scrobbler'
		);
		const scrobbler = new LastFmScrobbler();
		const song = new MockSong(
			'Some Artist',
			'Various Artists feat. Someone',
		);

		const result = await scrobbler.applyFilter(song);

		expect(result.parsed.albumArtist).to.equal('Various Artists');
	});

	it('should return the song with artist unchanged (no extraction)', async () => {
		const { default: LastFmScrobbler } = await import(
			'@/core/scrobbler/lastfm/lastfm-scrobbler'
		);
		const scrobbler = new LastFmScrobbler();
		const song = new MockSong('Artist1, Artist2', null);

		const result = await scrobbler.applyFilter(song);

		expect(result.processed.artist).to.equal('Artist1, Artist2');
		expect(result.parsed.artist).to.equal('Artist1, Artist2');
	});

	it('should be a no-op when album artist is absent', async () => {
		const { default: LastFmScrobbler } = await import(
			'@/core/scrobbler/lastfm/lastfm-scrobbler'
		);
		const scrobbler = new LastFmScrobbler();
		const song = new MockSong('Some Artist', null);

		const result = await scrobbler.applyFilter(song);

		expect(result.parsed.albumArtist).to.equal(null);
		expect(result.parsed.artist).to.equal('Some Artist');
	});
});
