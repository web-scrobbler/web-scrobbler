'use strict';

/* global Connector */

var trackInfo = null;

function updateTrackInfo() {
	trackInfo = JSON.parse(localStorage.getItem('audio_v10_track'));
}

Connector.artistTrackSelector = ".top_audio_player_title";
Connector.playerSelector = "#top_audio_player";

Connector.getArtist = function () {
			updateTrackInfo();
			return trackInfo[4] || null;
		};
Connector.getTrack = function () {
			updateTrackInfo();
			return trackInfo[3] || null;
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
