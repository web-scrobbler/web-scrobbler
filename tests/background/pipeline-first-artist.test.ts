/* eslint-disable @typescript-eslint/no-unused-expressions */

/**
 * Tests for the first-artist pipeline stage.
 *
 * The stage mirrors the first-artist logic of `LastFmScrobbler.applyFilter`
 * (see src/core/scrobbler/lastfm/lastfm-scrobbler.ts) as a pipeline processor,
 * and must be wired into `Pipeline.processors` between the second RegexEdits
 * stage and BlockedTags.
 */

import webextensionPolyfill from '#/mocks/webextension-polyfill';
import fetchPolyfill from '#/mocks/fetch';
import * as Options from '@/core/storage/options';
import * as FirstArtist from '@/core/object/pipeline/first-artist';
import Pipeline from '@/core/object/pipeline/pipeline';
import * as Metadata from '@/core/object/pipeline/metadata';
import * as BlockedTags from '@/core/object/pipeline/blocked-tags';
import type Song from '@/core/object/song';
import type { ProcessedSongData } from '@/core/object/song';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ensure polyfills are loaded;
webextensionPolyfill;
fetchPolyfill;

const mockGetOption = vi.hoisted(() => vi.fn());
const mockGetArtistAllowlist = vi.hoisted(() => vi.fn());

/**
 * Deterministic stand-in for the real extractor: returns the full artist name
 * when the allowlist is non-empty, otherwise the first comma-separated segment.
 */
const mockExtract = vi.hoisted(() =>
	vi.fn(async (artistName: string, allowlist: Set<bigint>) => {
		if (allowlist.size > 0) {
			return artistName;
		}
		return artistName.split(',')[0]?.trim() ?? '';
	}),
);
const mockFirstArtistProcess = vi.hoisted(() => vi.fn());

vi.mock('hash-wasm');

/**
 * The real options module must not be loaded: its import chain pulls in
 * `@/core/util/debug`, which calls `getOption` at module load, which would
 * race with the module's own initialization. A pure stub is sufficient, as
 * the stage under test only reads `LASTFM_FIRST_ARTIST_ONLY` via `getOption`.
 */
vi.mock('@/core/storage/options', () => ({
	LASTFM_FIRST_ARTIST_ONLY: 'lastfmFirstArtistOnly',
	// Read at import time by `@/core/util/debug`; value must simply be falsy.
	DEBUG_LOGGING_ENABLED: 'debugLoggingEnabled',
	getOption: mockGetOption,
}));

vi.mock('@/core/scrobbler/lastfm/artist-allowlist', () => ({
	getArtistAllowlist: mockGetArtistAllowlist,
}));

vi.mock('@/core/scrobbler/lastfm/first-artist-extractor', () => ({
	extract: mockExtract,
}));

/**
 * The stage under test is mocked with a spy that transparently delegates to
 * the real implementation, so the behavior tests exercise the real logic while
 * the Pipeline integration test can identify the stage by spy identity.
 */
vi.mock('@/core/object/pipeline/first-artist', async (importOriginal) => {
	const actual =
		await importOriginal<
			typeof import('@/core/object/pipeline/first-artist')
		>();
	return {
		...actual,
		process: mockFirstArtistProcess.mockImplementation(actual.process),
	};
});

interface MockSongOptions {
	artist?: string | null;
	albumArtist?: string | null;
	isCorrectedByUser?: boolean;
}

/**
 * Create a minimal Song-shaped object for pipeline stage testing.
 *
 * @param options - Artist, album artist and user-correction flag
 * @returns Song-shaped mock object
 */
function createSong(options: MockSongOptions = {}): Song {
	const processed: ProcessedSongData = {
		artist: options.artist ?? null,
		albumArtist: options.albumArtist ?? null,
	};
	const song = {
		flags: { isCorrectedByUser: options.isCorrectedByUser ?? false },
		processed,
		getArtist: () => processed.artist,
		getAlbumArtist: () => processed.albumArtist,
	} as unknown as Song;
	return song;
}

describe('first-artist pipeline process', () => {
	beforeEach(() => {
		mockGetOption.mockReset();
		mockGetArtistAllowlist.mockReset();
		mockExtract.mockClear();
		mockFirstArtistProcess.mockClear();
	});

	it('should return early when the song is corrected by the user', async () => {
		const song = createSong({
			artist: 'Artist1, Artist2',
			isCorrectedByUser: true,
		});

		await FirstArtist.process(song);

		expect(mockGetOption).not.toHaveBeenCalled();
		expect(mockGetArtistAllowlist).not.toHaveBeenCalled();
		expect(mockExtract).not.toHaveBeenCalled();
		expect(song.processed.artist).to.equal('Artist1, Artist2');
	});

	it('should return early when the toggle is OFF', async () => {
		mockGetOption.mockResolvedValue(false);
		const song = createSong({ artist: 'Artist1, Artist2' });

		await FirstArtist.process(song);

		expect(mockGetOption).toHaveBeenCalledWith(
			Options.LASTFM_FIRST_ARTIST_ONLY,
		);
		expect(mockGetArtistAllowlist).not.toHaveBeenCalled();
		expect(mockExtract).not.toHaveBeenCalled();
		expect(song.processed.artist).to.equal('Artist1, Artist2');
	});

	it('should extract the first artist when the toggle is ON', async () => {
		mockGetOption.mockResolvedValue(true);
		const allowlist = new Set<bigint>();
		mockGetArtistAllowlist.mockResolvedValue(allowlist);
		const song = createSong({ artist: 'Artist1, Artist2' });

		await FirstArtist.process(song);

		expect(mockGetArtistAllowlist).toHaveBeenCalledOnce();
		expect(mockExtract).toHaveBeenCalledWith('Artist1, Artist2', allowlist);
		expect(song.processed.artist).to.equal('Artist1');
	});

	it('should sync albumArtist when it matches the original artist', async () => {
		mockGetOption.mockResolvedValue(true);
		mockGetArtistAllowlist.mockResolvedValue(new Set<bigint>());
		const song = createSong({
			artist: 'Multi, Artist',
			albumArtist: 'Multi, Artist',
		});

		await FirstArtist.process(song);

		expect(song.processed.artist).to.equal('Multi');
		expect(song.processed.albumArtist).to.equal('Multi');
	});

	it('should keep albumArtist unchanged when it differs from the original artist', async () => {
		mockGetOption.mockResolvedValue(true);
		mockGetArtistAllowlist.mockResolvedValue(new Set<bigint>());
		const song = createSong({
			artist: 'Artist1, Artist2',
			albumArtist: 'Different Artist',
		});

		await FirstArtist.process(song);

		expect(song.processed.artist).to.equal('Artist1');
		expect(song.processed.albumArtist).to.equal('Different Artist');
	});

	it('should keep the full artist name when it is allowlisted', async () => {
		mockGetOption.mockResolvedValue(true);
		const allowlist = new Set([123n]);
		mockGetArtistAllowlist.mockResolvedValue(allowlist);
		const song = createSong({ artist: 'Tyler, The Creator' });

		await FirstArtist.process(song);

		expect(mockGetArtistAllowlist).toHaveBeenCalledOnce();
		expect(mockExtract).toHaveBeenCalledWith(
			'Tyler, The Creator',
			allowlist,
		);
		expect(song.processed.artist).to.equal('Tyler, The Creator');
	});

	it('should return early when the artist is falsy', async () => {
		const song = createSong({ artist: null });

		await FirstArtist.process(song);

		expect(mockGetOption).not.toHaveBeenCalled();
		expect(mockGetArtistAllowlist).not.toHaveBeenCalled();
		expect(mockExtract).not.toHaveBeenCalled();
	});

	it('should not crash on an empty-string artist', async () => {
		const song = createSong({ artist: '' });

		await FirstArtist.process(song);

		expect(mockGetOption).not.toHaveBeenCalled();
		expect(mockGetArtistAllowlist).not.toHaveBeenCalled();
		expect(mockExtract).not.toHaveBeenCalled();
		expect(song.processed.artist).to.equal('');
	});
});

describe('Pipeline integration', () => {
	it('should place the first-artist processor after Metadata and before BlockedTags', () => {
		const pipeline = new Pipeline();
		const processors = (pipeline as unknown as { processors: unknown[] })
			.processors;

		const metadataIndex = processors.findIndex(
			(p) => (p as { process?: unknown }).process === Metadata.process,
		);
		const firstArtistIndex = processors.findIndex(
			(p) =>
				(p as { process?: unknown }).process === mockFirstArtistProcess,
		);
		const blockedTagsIndex = processors.findIndex(
			(p) => (p as { process?: unknown }).process === BlockedTags.process,
		);

		expect(metadataIndex).to.be.above(-1);
		expect(firstArtistIndex).to.be.above(metadataIndex);
		expect(blockedTagsIndex).to.be.above(firstArtistIndex);
		expect(firstArtistIndex).to.equal(6);
		expect(processors.length).to.equal(9);
	});
});
