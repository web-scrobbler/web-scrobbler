'use strict';

/* global Connector, Util */

/**
 * The last track title. Used for detecting new songs.
 * @type {String}
 */
let lastTrackTitle = null;

/**
 * Object that holds information about song.
 * @type {Object}
 */
let songInfo = Util.emptyArtistTrack;

Connector.playerSelector = '.player';

Connector.trackArtSelector = '.player-artwork img';

Connector.getArtistTrack = function() {
	requestSongInfo();
	return songInfo;
};

Connector.isPlaying = function() {
	if (Util.isArtistTrackEmpty(songInfo)) {
		return false;
	}

	return $('.playPause ').hasClass('pause');
};

/**
 * Helper functions.
 */

/**
 * Update current song info asynchronously.
 */
function requestSongInfo() {
	if (isNewSongPlaying()) {
		let relativeUrl = $('#atitle a').attr('href');
		let albumInfoUrl = `http://gaana.com${relativeUrl}`;

		fetchSongInfo(albumInfoUrl).then((data) => {
			songInfo = data;
		}).catch(() => {
			resetSongInfo();
		});
	}
}

/**
 * Reset current song info.
 */
function resetSongInfo() {
	songInfo = Util.emptyArtistTrack;
}

/**
 * Check if song is changed.
 * @return {Boolean} True if new song is playing; false otherwise
 */
function isNewSongPlaying() {
	let track = $('#stitle').text();
	if (lastTrackTitle !== track) {
		lastTrackTitle = track;
		return true;
	}

	return false;
}

/**
 * Load artist page asynchronously and fetch artist name.
 * @param  {String} albumInfoUrl Album info URL
 * @return {Promise} Promise that will be resolved with the song info
 */
function fetchSongInfo(albumInfoUrl) {
	let track = lastTrackTitle;
	let artist = null;

	return new Promise((resolve, reject) => {
		$.ajax({ url: albumInfoUrl }).done((html) => {
			let $doc = $(html);

			let songs = $doc.find('.s_l').toArray();
			for (let song of songs) {
				let songTitle = $(song).find('.s_title .sng_c').text();
				if (songTitle === track) {
					let artists = $(song).find('.s_artist .sng_c').toArray();
					artist = Util.joinArtists(artists);
					break;
				}
			}

			resolve({ artist, track });
		}).fail((jqXhr, textStatus, errorThrown) => {
			reject(errorThrown);
		});
	});
}
