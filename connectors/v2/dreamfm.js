'use strict';

/* global Connector */

/*	What a y2k site design, seriously. Oh wait, it's VAPORWAVE!
	That explains everything.
*/
Connector.playerSelector = '#main > center';

/**
 * remove zero width characters & trim
 * @param  {string} text to clean up
 * @return {string} cleaned up text
 */
function cleanText(input) {
	if (input === null) {
		return input;
	}
	input = input.replace('´', '\'');
	input = input.replace('`', '\'');
	return input.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
}

// dreamfm.biz hack
function getDreamPlayer() {
	var players = $('#player > *, #player2 > *');
	var player = players.filter(':visible').first();
	return player || null;
}

Connector.getArtist = function() {
	var artist = getDreamPlayer().find('#tracka').text() ||
				null;
	return cleanText(artist);
};

Connector.getTrack = function() {
	var track = getDreamPlayer().find('#tracktitle').text() ||
				null;
	return cleanText(track);
};

Connector.getAlbum = function () {
	var album = getDreamPlayer().find('#album').text() ||
				null;
	return cleanText(album);
};

Connector.isPlaying = function() {
	var e = getDreamPlayer().find('button[title="Play"]');
	return (e === null || !e.is(':visible'));
};

Connector.getCurrentTime = function() {
	var audio = getDreamPlayer().find('audio')[0];
	if (audio === null) {
		return null;
	}
	return audio.currentTime;
}

Connector.getTrackArt = function() {
	return $('#imgcover').prop('src') ||
		null;
};

Connector.getDuration = function () {
	var audio = getDreamPlayer().find('audio')[0];
	if (audio === null) {
		return null;
	}
	return Math.round(audio.duration);
};

/** Returns a unique identifier of current track.
 *  @returns {String|null} */
Connector.getUniqueID = function () {
	var audio = getDreamPlayer().find('audio').first();
	var match = /&id=(\d+)&/.exec(audio.attr('src'));
	if (match) {
		return match[1];
	}
	return null;
};
