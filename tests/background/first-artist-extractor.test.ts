/**
 * Tests for first-artist-extractor and LastFmScrobbler.applyFilter integration.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Hoisted mocks (evaluated before imports)
// ---------------------------------------------------------------------------

const mockGetOption = vi.hoisted(() => vi.fn());
const mockGetArtistAllowlist = vi.hoisted(() => vi.fn());

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

vi.mock('@/core/storage/options', async (importOriginal) => {
	const actual =
		await importOriginal<typeof import('@/core/storage/options')>();
	return {
		...actual,
		getOption: mockGetOption,
	};
});

vi.mock('@/core/scrobbler/lastfm/artist-allowlist', () => ({
	getArtistAllowlist: mockGetArtistAllowlist,
}));

// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------

import { extract } from '@/core/scrobbler/lastfm/first-artist-extractor';
import { BaseSong } from '@/core/object/song';
import type { ParsedSongData, ProcessedSongData } from '@/core/object/song';
import type { ConnectorMeta } from '@/core/connectors';

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

	it('should return the full artist name when allowlist hash matches', () => {
		const allowlist = new Set([0n]);
		const result = extract('Tyler, The Creator', allowlist);
		expect(result).to.equal('Tyler, The Creator');
	});

	it('should return empty string for falsy input', () => {
		expect(extract('', emptySet)).to.equal('');
	});

	it('should return first artist for comma-separated input', () => {
		const result = extract('Artist1, Artist2, Artist3', emptySet);
		expect(result).to.equal('Artist1');
	});

	it('should return full name when no separator present', () => {
		const result = extract('Single Artist', emptySet);
		expect(result).to.equal('Single Artist');
	});

	it('should return first artist for "feat." separated input', () => {
		const result = extract('Artist1 feat. Artist2', emptySet);
		expect(result).to.equal('Artist1');
	});

	it('should return first artist for " & " separated input', () => {
		const result = extract('Artist1 & Artist2', emptySet);
		expect(result).to.equal('Artist1');
	});

	it('should return first artist for "vs." separated input', () => {
		const result = extract('Artist1 vs. Artist2', emptySet);
		expect(result).to.equal('Artist1');
	});

	it('should return first artist for "x" separated input', () => {
		const result = extract('Artist1 x Artist2', emptySet);
		expect(result).to.equal('Artist1');
	});

	it('should return first artist for "•" separated input', () => {
		const result = extract('Artist1 • Artist2', emptySet);
		expect(result).to.equal('Artist1');
	});

	it('should handle comma without space separator', () => {
		const result = extract('A,B', emptySet);
		expect(result).to.equal('A');
	});

	it('should handle non-ASCII characters', () => {
		const result = extract('ファイターズ, 何か', emptySet);
		expect(result).to.equal('ファイターズ');
	});

	it('should return full name when allowlist matches (prefix matching path)', () => {
		const allowlist = new Set([0n]);
		const result = extract('Earth, Wind & Fire', allowlist);
		expect(result).to.equal('Earth, Wind & Fire');
	});
});

// ---------------------------------------------------------------------------
// Tests: LastFmScrobbler.applyFilter()
// ---------------------------------------------------------------------------

describe('LastFmScrobbler.applyFilter', () => {
	beforeEach(() => {
		mockGetOption.mockReset();
		mockGetArtistAllowlist.mockReset();
	});

	it('should skip extraction when toggle is OFF', async () => {
		mockGetOption.mockResolvedValue(false);

		const { default: LastFmScrobbler } = await import(
			'@/core/scrobbler/lastfm/lastfm-scrobbler'
		);
		const scrobbler = new LastFmScrobbler();
		const song = new MockSong('Artist1, Artist2', null);

		const result = await scrobbler.applyFilter(song);

		expect(result.processed.artist).to.equal('Artist1, Artist2');
		expect(mockGetOption).toHaveBeenCalledWith('lastfmFirstArtistOnly');
		expect(mockGetArtistAllowlist).not.toHaveBeenCalled();
	});

	it('should extract first artist when toggle is ON', async () => {
		mockGetOption.mockResolvedValue(true);
		mockGetArtistAllowlist.mockResolvedValue(new Set<bigint>());

		const { default: LastFmScrobbler } = await import(
			'@/core/scrobbler/lastfm/lastfm-scrobbler'
		);
		const scrobbler = new LastFmScrobbler();
		const song = new MockSong('Artist1, Artist2', null);

		const result = await scrobbler.applyFilter(song);

		expect(result.processed.artist).to.equal('Artist1');
		expect(mockGetArtistAllowlist).toHaveBeenCalledOnce();
	});

	it('should return song unchanged when artist is null', async () => {
		mockGetOption.mockResolvedValue(true);

		const { default: LastFmScrobbler } = await import(
			'@/core/scrobbler/lastfm/lastfm-scrobbler'
		);
		const scrobbler = new LastFmScrobbler();
		const song = new MockSong(null, null);

		const result = await scrobbler.applyFilter(song);

		expect(result.processed.artist).to.equal(null);
		expect(mockGetOption).not.toHaveBeenCalled();
	});

	it('should sync albumArtist when it matches original artist', async () => {
		mockGetOption.mockResolvedValue(true);
		mockGetArtistAllowlist.mockResolvedValue(new Set<bigint>());

		const { default: LastFmScrobbler } = await import(
			'@/core/scrobbler/lastfm/lastfm-scrobbler'
		);
		const scrobbler = new LastFmScrobbler();
		const song = new MockSong('Multi, Artist', 'Multi, Artist');

		const result = await scrobbler.applyFilter(song);

		expect(result.processed.artist).to.equal('Multi');
		expect(result.processed.albumArtist).to.equal('Multi');
	});

	it('should keep albumArtist unchanged when it does not match original artist', async () => {
		mockGetOption.mockResolvedValue(true);
		mockGetArtistAllowlist.mockResolvedValue(new Set<bigint>());

		const { default: LastFmScrobbler } = await import(
			'@/core/scrobbler/lastfm/lastfm-scrobbler'
		);
		const scrobbler = new LastFmScrobbler();
		const song = new MockSong('Artist1, Artist2', 'Different Artist');

		const result = await scrobbler.applyFilter(song);

		expect(result.processed.artist).to.equal('Artist1');
		expect(result.processed.albumArtist).to.equal('Different Artist');
	});

	it('should normalize "Various Artists" in album artist', async () => {
		mockGetOption.mockResolvedValue(false);

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

	it('should not extract when artist is in allowlist', async () => {
		mockGetOption.mockResolvedValue(true);
		mockGetArtistAllowlist.mockResolvedValue(new Set([0n]));

		const { default: LastFmScrobbler } = await import(
			'@/core/scrobbler/lastfm/lastfm-scrobbler'
		);
		const scrobbler = new LastFmScrobbler();
		const song = new MockSong('Tyler, The Creator', null);

		const result = await scrobbler.applyFilter(song);

		expect(result.processed.artist).to.equal('Tyler, The Creator');
		expect(mockGetArtistAllowlist).toHaveBeenCalledOnce();
	});

	it('should handle empty string artist without crashing', async () => {
		mockGetOption.mockResolvedValue(true);

		const { default: LastFmScrobbler } = await import(
			'@/core/scrobbler/lastfm/lastfm-scrobbler'
		);
		const scrobbler = new LastFmScrobbler();
		const song = new MockSong('', null);

		const result = await scrobbler.applyFilter(song);

		expect(result.processed.artist).to.equal('');
	});
});
