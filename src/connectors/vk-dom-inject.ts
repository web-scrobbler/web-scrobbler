/**
 * This script runs in non-isolated environment (vk.com itself)
 * for accessing `window.ap` which sends player events.
 *
 * Script is run as an IIFE to ensure variables are scoped, as in the event
 * of extension reload/update a new script will have to override the current one.
 *
 * Script starts by calling window.cleanup to cleanup any potential previous script.
 *
 * @returns a cleanup function that cleans up event listeners and similar for a future overriding script.
 */

// cleanup previous script
if ('cleanup' in window && typeof window.cleanup === 'function') {
	(window as unknown as { cleanup: () => void }).cleanup();
}

(window as unknown as { cleanup: () => void }).cleanup = (() => {
	const INFO_ID = 0;
	const INFO_OWNER_ID = 1;
	const INFO_TRACK = 3;
	const INFO_ARTIST = 4;
	const INFO_DURATION = 5;
	const INFO_TRACK_ARTS = 14;
	const INFO_ADDITIONAL = 16;

	const listeners: Record<string, () => void> = {};

	setupEventListeners();

	interface Window {
		ap: {
			_currentAudio?: string[];
			_currentPlaylist?: {
				_ref: {
					// Get album title
					getTitle: () => string;
					// Get type of album: "playlist" or "album"
					getType: () => string;
				};
			};
			_impl: { _currentAudioEl?: { currentTime: string } };
			isPlaying: () => boolean;
			subscribers: {
				et: string;
				cb: () => void;
			}[];
		};
	}

	function sendUpdateEvent(type: string) {
		const ctx = (window as unknown as Window).ap;

		const audioObject = ctx._currentAudio;

		if (!audioObject) {
			return;
		}

		const albumType = ctx._currentPlaylist?._ref.getType();
		const title = ctx._currentPlaylist?._ref.getTitle();
		const album = (() => {
			switch (albumType) {
				case 'album':
					// Аlbums in VK usually contain the correct title
					return title || '';
				case 'playlist':
					// But playlists can have different formats that may
					// contain unnecessary information
					return title ? cleanPlaylistName(title) : '';
				default:
					return '';
			}
		})();

		const currentTime = (window as unknown as Window).ap._impl
			._currentAudioEl?.currentTime;

		/*
		 * VK player sets current time equal to song duration on startup.
		 * This makes the extension to think the song is seeking to its
		 * beginning, and repeat the song. Ignore this stage to avoid
		 * this behavior.
		 */
		if (currentTime === audioObject[INFO_DURATION]) {
			return;
		}
		const trackArt = extractTrackArt(audioObject[INFO_TRACK_ARTS]);

		let track = audioObject[INFO_TRACK];
		const additionalInfo = audioObject[INFO_ADDITIONAL];
		if (additionalInfo) {
			track = `${track} (${additionalInfo})`;
		}

		window.postMessage(
			{
				sender: 'web-scrobbler',
				type,
				trackInfo: {
					currentTime,
					trackArt,
					track,
					album,
					duration: audioObject[INFO_DURATION],
					uniqueID: `${audioObject[INFO_OWNER_ID]}_${audioObject[INFO_ID]}`,
					artist: audioObject[INFO_ARTIST],
				},
			},
			'*',
		);
	}

	function setupEventListeners() {
		for (const e of ['start', 'progress', 'pause', 'stop']) {
			listeners[e] = sendUpdateEvent.bind(null, e);
			(window as unknown as Window).ap.subscribers.push({
				et: e,
				cb: listeners[e],
			});
		}
		if ((window as unknown as Window).ap.isPlaying()) {
			sendUpdateEvent('start');
		}
	}

	/**
	 * Extract largest track art from list of track art URLs.
	 * @param trackArts - String contains list of track art URLs
	 * @returns Track art URL
	 */
	function extractTrackArt(trackArts: string) {
		const trackArtArr = trackArts.split(',');
		return trackArtArr.pop();
	}

	return () => {
		// remove the subscribers added by this extension from the array.
		// we dont have a confirmed reference to it so we have to check all of them.
		(window as unknown as Window).ap.subscribers = (
			window as unknown as Window
		).ap.subscribers.filter(
			(e) =>
				!(e.et && typeof e.et === 'string' && e.cb === listeners[e.et]),
		);
	};
})();

/**
 * Clean playlist name specific to VK
 * Many playlists in VK have structure like:
 *	1. "Artist - Album name"
 *	2. "Artist - Album name: Disk Name"
 *  3. "Artist - Album name Disk Number: Disk Name"
 *
 * @param playlist - Playlist name with possible unnecessary information
 * @returns Cleaned playlist name
 */
function cleanPlaylistName(playlist: string): string {
	// Clean unnecessary information in parentheses (for example, "(2021, Longinus Recordings)")
	let cleaned = playlist.replace(/\(.*?\)/g, '');

	// Remove Artist part
	const artistSeparators = ['-', '–', '—'];
	for (const sep of artistSeparators) {
		if (cleaned.includes(sep)) {
			cleaned = cleaned.split(sep)[1];
			break;
		}
	}
	// Remove {Disk Name} part
	if (cleaned.includes(':')) {
		cleaned = cleaned.split(':')[0];
	}

	// Remove Disk Number part: "Disc 20", "Disk 1", "CD 2", "Part 3"
	cleaned = cleaned.replace(/\b(Disc|Disk|CD|Part)\s*\d+\b/gi, '');

	return cleaned.trim();
}
