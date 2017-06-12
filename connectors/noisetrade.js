'use strict';

/* global Connector */

// bind audio element events to fire state changes, in lieu of using playerSelector
$('audio').first().bind('playing pause', Connector.onStateChanged);

/**
 * If all the songs contain a hyphen "-", it's more than likely that the album has
 * various artists and the playlist item text is in the form "Artist - Track".
 *
 * @type {boolean} true if all tracks contain a hyphen, otherwise false
 */
var albumHasVariousArtists = (function () {
	var all = true;
	$('a.jp-playlist-item').each(function () {
		if ($(this).text().indexOf('-') === -1) {
			all = false;
			return false;
		}
	});
	return all;
}());

/**
 * Check if given argument is a number.
 *
 * @param {Object} n Any object
 * @return {Boolean} True if object is a number; false otherwise
 */
function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * If all the songs start with at least two numbers, it's more than likely that
 * the tracks were added with track numbers as part of their title.
 *
 * @type {boolean} true if all tracks start with at least two numbers, otherwise false
 */
var trackTitlesStartWithTrackNo = (function () {
	var all = true;
	$('a.jp-playlist-item').each(function () {
		if (!isNumber($(this).text().substring(0, 2))) {
			all = false;
			return false;
		}
	});
	return all;
}());

// the position of artist & album were switched but the class names
//  weren't updated (album has class name of "artist")
Connector.albumSelector = '.col_album_titles h1.artist';

Connector.getArtistTrack = function () {
	// the position of artist & album were switched but the class names
	//  weren't updated (artist has class name of "album")
	var artist = $('.col_album_titles h2.album a').text() || null,
		track = $('a.jp-playlist-current').text() || null,
		execResult;
	if (trackTitlesStartWithTrackNo) {
		track = track.substring(2);
	}
	if (albumHasVariousArtists) {
		execResult = /([\w\W]+)\s?-\s?([\w\W]+)/.exec(track);
		if (execResult) {
			artist = execResult[1];
			track = execResult[2];
		}
	}
	return { artist, track };
};

/** @returns {Boolean} true if playing, false otherwise */
Connector.isPlaying = function () {
	return $('audio')[0] && !$('audio')[0].paused;
};

/** @returns {number|null} track length in seconds */
Connector.getDuration = function () {
	return ($('audio')[0] && $('audio')[0].duration);
};

/** @returns {String|null} a unique identifier of current track */
Connector.getUniqueID = function () {
	return $('audio').first().attr('src');
};

Connector.trackArtSelector = 'img.album_page_shadow';
