import '#/mocks/webextension-polyfill';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/util/communication', () => ({
	backgroundListener: (listener: unknown) => listener,
	sendBackgroundMessage: vi.fn(),
	sendContentMessage: vi.fn(),
	setupBackgroundListeners: vi.fn(),
}));

import scrobbleService from '@/core/object/scrobble-service';
import { ServiceCallResult } from '@/core/object/service-call-result';
import Song from '@/core/object/song';
import scrobbleCache from '@/core/storage/scrobble-cache';
import { ScrobbleStatus } from '@/core/storage/wrapper';

const connector = {
	id: 'test',
	js: 'test.js',
	label: 'Test',
	matches: ['https://example.com/*'],
};

function createSong() {
	return new Song(
		{
			album: null,
			albumArtist: null,
			artist: 'Artist',
			currentTime: 30,
			duration: 180,
			isPlaying: true,
			isPodcast: false,
			originUrl: 'https://example.com/track',
			track: 'Track',
			trackArt: null,
			uniqueID: null,
		},
		connector,
	);
}

describe('ScrobbleService API failures', () => {
	const scrobbler = scrobbleService.getScrobblerByLabel('Last.fm');

	if (!scrobbler) {
		throw new Error('Last.fm scrobbler is not registered');
	}

	afterEach(() => {
		scrobbleService.unbindScrobbler(scrobbler);
		vi.restoreAllMocks();
	});

	it('returns an error result when now-playing rejects with an Error', async () => {
		scrobbleService.bindScrobbler(scrobbler);
		vi.spyOn(scrobbler, 'sendNowPlaying').mockRejectedValue(
			new Error(ServiceCallResult.ERROR_OTHER),
		);

		await expect(
			scrobbleService.sendNowPlaying(createSong()),
		).resolves.toEqual([ServiceCallResult.ERROR_OTHER]);
	});

	it('caches a failed scrobble when the API rejects with an Error', async () => {
		const song = createSong();
		scrobbleService.bindScrobbler(scrobbler);
		vi.spyOn(scrobbler, 'scrobble').mockRejectedValue(
			new Error(ServiceCallResult.ERROR_OTHER),
		);
		const cacheSpy = vi
			.spyOn(scrobbleCache, 'pushScrobble')
			.mockResolvedValue(1);

		await expect(scrobbleService.scrobble([song], true)).resolves.toEqual([
			[ServiceCallResult.ERROR_OTHER],
		]);
		expect(cacheSpy).toHaveBeenCalledWith({
			song: song.getCloneableData(),
			status: ScrobbleStatus.ERROR,
		});
	});
});
