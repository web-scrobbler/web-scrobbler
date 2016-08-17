'use strict';

/* global Connector */

var INFO_TRACK = 3;
var INFO_ARTIST = 4;
var INFO_DURATION = 5;

var trackInfo = null;

function updateTrackInfo() {
	trackInfo = JSON.parse(localStorage.getItem('audio_v10_track'));
}

/**
 * Decodes HTML entities in given text string
 * @param  {String} str String with HTML entities
 * @return {String}     Decoded string
 */
var decodeHtmlEntity = function(str) {
	if (str === null) {
		return null;
	}

	return str.replace(/&#(\d+);/g, function(match, dec) {
		return String.fromCharCode(dec);
	});
};


Connector.artistTrackSelector = '.top_audio_player_title';
Connector.playerSelector = '#top_audio_player';

Connector.getArtist = function () {
			updateTrackInfo();
			return decodeHtmlEntity(trackInfo[INFO_ARTIST]);
		};
Connector.getTrack = function () {
			updateTrackInfo();
			return decodeHtmlEntity(trackInfo[INFO_TRACK]);
		};
Connector.getCurrentTime = function () {
			updateTrackInfo();
			var progress = parseFloat(localStorage.getItem('audio_v10_progress'));
			return Math.round(parseInt(trackInfo[INFO_DURATION]) * progress);
		};
Connector.getDuration = function () {
			updateTrackInfo();
			return parseInt(trackInfo[INFO_DURATION]);
		};
Connector.isPlaying = function() {
	return $(this.playerSelector).hasClass('top_audio_player_playing');
		};
