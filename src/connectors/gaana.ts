export {};

/**
 * The last track title. Used for detecting new songs.
 */
let lastTrackTitle: string | null = null;

/**
 * Object that holds information about song.
 * @type {Object}
 */
let songInfo: {
	artist: string | null;
	track: string | null;
} | null = null;

Connector.playerSelector = '.player';

Connector.trackArtSelector = '.player-artwork img';

Connector.getArtistTrack = () => {
	requestSongInfo();
	return songInfo;
};

Connector.isPlaying = () => {
	if (Util.isArtistTrackEmpty(songInfo)) {
		return false;
	}

	return Util.hasElementClass('.playPause', 'pause');
};

/**
 * Helper functions.
 */

/**
 * Update current song info asynchronously.
 */
async function requestSongInfo() {
	if (isNewSongPlaying()) {
		const relativeUrl = Util.getAttrFromSelectors('#atitle a', 'href');
		const albumInfoUrl = `https://gaana.com${relativeUrl}`;

		try {
			songInfo = await fetchSongInfo(albumInfoUrl);
		} catch (err) {
			Util.debugLog(`Error: ${err}`, 'error');

			resetSongInfo();
		}
	}
}

/**
 * Reset current song info.
 */
function resetSongInfo() {
	songInfo = null;
}

/**
 * Check if song is changed.
 * @return {Boolean} True if new song is playing; false otherwise
 */
function isNewSongPlaying() {
	const track = Util.getTextFromSelectors('#stitle');

	if (lastTrackTitle !== track) {
		lastTrackTitle = track;
		return true;
	}

	return false;
}

/**
 * Load artist page asynchronously and fetch artist name.
 * @param albumInfoUrl - Album info URL
 * @return Promise that will be resolved with the song info
 */
async function fetchSongInfo(albumInfoUrl: string) {
	const track = lastTrackTitle;
	let artist = null;

	const response = await fetch(albumInfoUrl);
	const result = await response.text();

	const doc = new DOMParser().parseFromString(result, 'text/html');
	const songElements = doc.querySelectorAll('.s_c > ul > [data-value]');

	for (const song of songElements) {
		const songTitleElement = song.querySelector('.s_title .sng_c');

		if (songTitleElement) {
			const songTitle = songTitleElement.textContent?.trim();

			if (songTitle === track) {
				const artists = song.querySelectorAll('.s_artist .sng_c');
				artist = Util.joinArtists(Array.from(artists));
				break;
			}
		}
	}

	return { artist, track };
}
