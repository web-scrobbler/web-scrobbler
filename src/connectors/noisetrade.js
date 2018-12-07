'use strict';

$('audio').first().bind('playing pause', Connector.onStateChanged);

/**
 * If all the songs contain a hyphen "-", it's more than likely that the album has
 * letious artists and the playlist item text is in the form "Artist - Track".
 *
 * @type {Boolean} true if all tracks contain a hyphen, otherwise false
 */
let albumHasletiousArtists = (function() {
	let all = true;
	$('a.jp-playlist-item').each(function() {
		if (!$(this).text().includes('-')) {
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
 * @type {Boolean} true if all tracks start with at least two numbers, otherwise false
 */
let trackTitlesStartWithTrackNo = (function() {
	let all = true;
	$('a.jp-playlist-item').each(function() {
		if (!isNumber($(this).text().substring(0, 2))) {
			all = false;
			return false;
		}
	});
	return all;
}());

/*
 * The position of artist & album were switched but the class names
 * weren't updated (album has class name of "artist")
 */
Connector.albumSelector = 'h1.artist';

Connector.getArtistTrack = () => {
	// the position of artist & album were switched but the class names
	//  weren't updated (artist has class name of "album")
	let artist = $('h2.album a').text();
	let track = $('a.jp-playlist-current').text();

	if (trackTitlesStartWithTrackNo) {
		track = track.substring(2);
	}
	if (albumHasletiousArtists) {
		let execResult = /([\w\W]+)\s?-\s?([\w\W]+)/.exec(track);
		if (execResult) {
			artist = execResult[1];
			track = execResult[2];
		}
	}
	return { artist, track };
};

Connector.isPlaying = () => {
	return $('audio')[0] && !$('audio')[0].paused;
};

Connector.getDuration = () => {
	return ($('audio')[0] && $('audio')[0].duration);
};

Connector.getUniqueID = () => {
	return $('audio').first().attr('src');
};

Connector.trackArtSelector = '.albumart';
