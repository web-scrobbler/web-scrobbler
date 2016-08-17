'use strict';

/* global Connector */

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
			return decodeHtmlEntity(trackInfo[4]);
		};
Connector.getTrack = function () {
			updateTrackInfo();
			return decodeHtmlEntity(trackInfo[3]);
		};
Connector.getCurrentTime = function () {
			updateTrackInfo();
			var progress = parseFloat(localStorage.getItem('audio_v10_progress'));
			return Math.round(parseInt(trackInfo[5])*progress);
		};
Connector.getDuration = function () {
			updateTrackInfo();
			return parseInt(trackInfo[5]);
		};
Connector.isPlaying = function() {
	return $(this.playerSelector).hasClass('top_audio_player_playing');
		};
