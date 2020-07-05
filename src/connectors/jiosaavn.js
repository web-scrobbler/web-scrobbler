'use strict';

/**
 * The latest track info URL.
 * @type {String}
 */
let currentTrackInfoUrl = null;

/**
 * Object that holds information about song.
 * @type {Object}
 */
let songInfo = null;

Connector.playerSelector = '#now-playing';

Connector.currentTimeSelector = '#track-elapsed';

Connector.durationSelector = '#track-time';

Connector.getArtistTrack = () => {
	requestSongInfo();
	return songInfo;
};

Connector.isPlaying = () => {
	if (Util.isArtistTrackEmpty(songInfo)) {
		return false;
	}

	return Util.hasElementClass('#controls #play', 'hide');
};

/**
 * Helper functions.
 */

/**
 * Update current song info asynchronously.
 */
async function requestSongInfo() {
	if (isNewSongPlaying()) {
		try {
			songInfo = await fetchSongInfo(currentTrackInfoUrl);
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
	const scriptBody = Util.getAttrFromSelectors('#player-track-name a', 'onclick');
	const trackInfoUrl = getUrlFromScript(scriptBody);

	if (trackInfoUrl !== null && trackInfoUrl !== currentTrackInfoUrl) {
		currentTrackInfoUrl = trackInfoUrl;
		return true;
	}

	return false;
}

/**
 * Load artist page asynchronously and fetch artist name.
 * @param {String} trackInfoUrl Track info URL
 * @return {Promise} Promise that will be resolved with the song info
 */
async function fetchSongInfo(trackInfoUrl) {
	const response = await fetch(trackInfoUrl);
	const result = await response.text();

	const doc = new DOMParser().parseFromString(result, 'text/html');

	const artistNode = doc.querySelector('.page-meta-group > .meta-list');
	const artist = artistNode && artistNode.textContent;
	const track = Util.getTextFromSelectors('#player-track-name');
	const album = Util.getTextFromSelectors('#player-album-name');

	return { artist, track, album };
}

/**
 * Get URL from JioSaavn JavaScript script body.
 * @param {String} scriptBody Script body
 * @return {String} URL
 */
function getUrlFromScript(scriptBody) {
	// Script format: Util.logAndGoToUrl('whatever', 'URL');
	const pattern = /.+?\('.+?',\s'(.+?)'\)/;
	const match = pattern.exec(scriptBody);
	if (match) {
		return match[1];
	}

	return null;
}
