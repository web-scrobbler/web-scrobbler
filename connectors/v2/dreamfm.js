'use strict';

/* global Connector */

Connector.playerSelector = '#player';

/**
 * remove zero width characters & trim
 * @param  {string} text to clean up
 * @return {string} cleaned up text
 */
function cleanText(input) {
	if (input === null) {
		return input;
	}
	return input.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
}

Connector.getArtist = function() {
	var artist = $('#tracka').text() ||
				null;
	return cleanText(artist);
};

Connector.getTrack = function() {
	var track = $('#tracktitle').text() ||
				null;
	return cleanText(track);
};

Connector.getAlbum = function () {
	var album = $('#album').text() ||
				null;
	return cleanText(album);
};

Connector.isPlaying = function() {
	var e = $('.play-pause .play');
	return (e === null || !e.is(':visible'));
};

Connector.currentTimeSelector = '.played';

Connector.getTrackArt = function() {
	return $('#imgcover').prop('src');
};

Connector.getDuration = function () {
	return Math.round($('audio')[0].duration);
};

/** Returns a unique identifier of current track.
 *  @returns {String|null} */
Connector.getUniqueID = function () {
	var match = /&id=(\d+)&/.exec($('audio').first().attr('src'));
	if (match) {
		return match[1];
	}
	return null;
};
