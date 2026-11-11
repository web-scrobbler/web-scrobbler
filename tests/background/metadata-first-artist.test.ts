/* eslint-disable @typescript-eslint/no-unused-expressions */

/**
 * Tests for the "first artist" override applied to the `getSongInfo` query
 * fired by the Metadata pipeline stage.
 */

import webextensionPolyfill from '#/mocks/webextension-polyfill';
import fetchPolyfill from '#/mocks/fetch';
import * as FirstArtist from '@/core/object/pipeline/first-artist';
import * as Metadata from '@/core/object/pipeline/metadata';
import type Song from '@/core/object/song';
import type { ProcessedSongData } from '@/core/object/song';
import type { ConnectorMeta } from '@/core/connectors';
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

/**
 * Captures the payload of every `sendContentMessage` call, so tests can assert
 * on the exact `getSongInfo` payload the Metadata stage would send.
 */
const mockSendContentMessage = vi.hoisted(() => vi.fn());

vi.mock('hash-wasm');

vi.mock('@/core/storage/options', () => ({
	FIRST_ARTIST_ONLY: 'firstArtistOnly',
	FORCE_RECOGNIZE: 'forceRecognize',
	SCROBBLE_EDITED_TRACKS_ONLY: 'scrobbleEditedTracksOnly',
	ALBUM_GUESSING_DISABLED: 'albumGuessingDisabled',
	ALBUM_GUESSING_ALL_TRACKS: 'albumGuessingAllTracks',
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
 * The `getFirstArtistForSong` helper (real logic) is exercised while
 * `sendContentMessage` is stubbed to capture the payload.
 */
vi.mock('@/util/communication', () => ({
	sendContentMessage: mockSendContentMessage,
}));

interface MockSongOptions {
	artist?: string | null;
	album?: string | null;
	track?: string | null;
	albumArtist?: string | null;
	isCorrectedByUser?: boolean;
}

/**
 * Create a minimal Song-shaped object for Metadata stage testing.
 *
 * @param options - Song fields and flags
 * @returns Song-shaped mock object
 */
function createSong(options: MockSongOptions = {}): Song {
	const processed: ProcessedSongData = {
		artist: options.artist ?? null,
		album: options.album ?? null,
		track: options.track ?? null,
		albumArtist: options.albumArtist ?? null,
	};
	const flags = { isCorrectedByUser: options.isCorrectedByUser ?? false };
	const song = {
		flags,
		processed,
		getArtist: () => processed.artist,
		getAlbum: () => processed.album,
		getTrack: () => processed.track,
		getAlbumArtist: () => processed.albumArtist,
		isEmpty: () => !processed.artist || !processed.track,
		getCloneableData: () => ({
			parsed: {},
			noRegex: {},
			// Snapshot the processed fields: over the real IPC boundary the
			// payload is a copy, so later mutations to the live song must not
			// leak back into the captured query payload.
			processed: { ...processed },
			metadata: {},
			flags: { ...flags },
			connector: { id: 'test' },
		}),
	} as unknown as Song;
	return song;
}

const connector = { id: 'test' } as unknown as ConnectorMeta;

/**
 * Return the artist carried by the captured `getSongInfo` payload.
 *
 * @returns Artist string from the captured payload, or null
 */
function getSentArtist(): string | null {
	const call = mockSendContentMessage.mock.calls[0];
	if (!call) {
		return null;
	}
	const payload = call[0] as {
		payload: { song: { processed?: { artist?: string | null } } };
	};
	return payload.payload.song.processed?.artist ?? null;
}

describe('metadata first-artist query override', () => {
	beforeEach(() => {
		mockGetOption.mockReset();
		mockGetArtistAllowlist.mockReset();
		mockExtract.mockClear();
		mockSendContentMessage.mockReset();
		mockSendContentMessage.mockResolvedValue([]);
	});

	it('should send the first artist in the getSongInfo payload when the option is ON', async () => {
		mockGetOption.mockResolvedValue(true);
		mockGetArtistAllowlist.mockResolvedValue(new Set<bigint>());
		const song = createSong({
			artist: 'Dawid Podsiadło, P.T. Adamczyk',
			track: 'Phantom Liberty',
		});

		await Metadata.process(song, connector);

		expect(mockSendContentMessage).toHaveBeenCalledOnce();
		expect(getSentArtist()).to.equal('Dawid Podsiadło');
	});

	it('should send the full artist when the option is OFF', async () => {
		mockGetOption.mockResolvedValue(false);
		const song = createSong({
			artist: 'Dawid Podsiadło, P.T. Adamczyk',
			track: 'Phantom Liberty',
		});

		await Metadata.process(song, connector);

		expect(mockSendContentMessage).toHaveBeenCalledOnce();
		expect(getSentArtist()).to.equal('Dawid Podsiadło, P.T. Adamczyk');
	});

	it('should send the full allowlisted name unchanged', async () => {
		mockGetOption.mockResolvedValue(true);
		mockGetArtistAllowlist.mockResolvedValue(new Set([123n]));
		const song = createSong({
			artist: 'Tyler, The Creator feat. Frank Ocean',
			track: 'Track',
		});

		await Metadata.process(song, connector);

		expect(mockSendContentMessage).toHaveBeenCalledOnce();
		expect(getSentArtist()).to.equal(
			'Tyler, The Creator feat. Frank Ocean',
		);
	});

	it('should not override the artist for a user-corrected song', async () => {
		mockGetOption.mockResolvedValue(true);
		mockGetArtistAllowlist.mockResolvedValue(new Set<bigint>());
		const song = createSong({
			artist: 'Dawid Podsiadło, P.T. Adamczyk',
			track: 'Phantom Liberty',
			isCorrectedByUser: true,
		});

		await Metadata.process(song, connector);

		expect(mockSendContentMessage).toHaveBeenCalledOnce();
		expect(getSentArtist()).to.equal('Dawid Podsiadło, P.T. Adamczyk');
	});

	it('should match the first-artist processor result for the same song', async () => {
		mockGetOption.mockResolvedValue(true);
		mockGetArtistAllowlist.mockResolvedValue(new Set<bigint>());
		const song = createSong({
			artist: 'Dawid Podsiadło, P.T. Adamczyk',
			track: 'Phantom Liberty',
		});

		await Metadata.process(song, connector);
		await FirstArtist.process(song);

		const payloadArtist = getSentArtist();
		expect(payloadArtist).to.equal(song.processed.artist);
		expect(payloadArtist).to.equal('Dawid Podsiadło');
	});

	it('should use the real extractor result when only options are mocked', async () => {
		mockGetOption.mockResolvedValue(true);
		mockGetArtistAllowlist.mockResolvedValue(new Set<bigint>());
		const song = createSong({
			artist: 'Dawid Podsiadło, P.T. Adamczyk',
			track: 'Phantom Liberty',
		});

		await Metadata.process(song, connector);

		expect(mockExtract).toHaveBeenCalledWith(
			'Dawid Podsiadło, P.T. Adamczyk',
			expect.any(Set),
		);
		expect(getSentArtist()).to.equal('Dawid Podsiadło');
	});
});
