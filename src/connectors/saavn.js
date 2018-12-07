'use strict';

/**
 * An example of connector that loads information about song asynchronously.
 * Note that current time and duration are still synchronous.
 */

/**
 * The latest track info URL.
 * @type {String}
 */
let lastTrackInfoUrl = null;

/**
 * Object that holds information about song.
 * @type {Object}
 */
let songInfo = Util.makeEmptyArtistTrack();

/**
 * Connector object setup.
 */

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
	return $('#controls #play').hasClass('hide');
};

/**
 * Helper functions.
 */

/**
 * Update current song info asynchronously.
 */
function requestSongInfo() {
	let scriptBody = $('#player-track-name a').attr('onclick');
	let trackInfoUrl = getUrlFromScript(scriptBody);

	let isNewSong = (trackInfoUrl && trackInfoUrl !== lastTrackInfoUrl);
	if (isNewSong) {
		resetSongInfo();
		fetchSongInfo(trackInfoUrl).then((data) => {
			songInfo = data;
		}).catch((err) => {
			console.error(`Error: ${err}`);
		});

		lastTrackInfoUrl = trackInfoUrl;
	}
}

/**
 * Reset current song info.
 */
function resetSongInfo() {
	songInfo = Util.makeEmptyArtistTrack();
}

/**
 * Load artist page asynchronously and fetch artist name.
 * @param  {String} trackInfoUrl Track info URL
 * @return {Promise} Promise that will be resolved with the song info
 */
function fetchSongInfo(trackInfoUrl) {
	return new Promise((resolve, reject) => {
		$.ajax({ url: trackInfoUrl }).done((html) => {
			let $doc = $(html);
			let artist = $doc.find('.page-meta-group > .meta-list')
				.first().text() || null;
			let track = $('#player-track-name').text() || null;
			resolve({ artist, track });
		}).fail((jqXhr, textStatus, errorThrown) => {
			reject(errorThrown);
		});
	});
}

/**
 * Get URL from Saavn JavaScript script body.
 * @param  {String} scriptBody Script body
 * @return {String} URL
 */
function getUrlFromScript(scriptBody) {
	// Script format: Util.logAndGoToUrl('whatever', 'URL');
	let pattern = /.+?\('.+?',\s'(.+?)'\)/;
	let match = pattern.exec(scriptBody);
	if (match) {
		return match[1];
	}

	return null;
}
