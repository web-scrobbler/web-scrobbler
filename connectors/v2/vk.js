'use strict';

/* global Connector */

var INFO_ID = 0;
var INFO_TRACK = 3;
var INFO_ARTIST = 4;
var INFO_DURATION = 5;

var trackInfo = null;
var isPlaying = false;

(function () {
	$(document.documentElement).append($('<script>', {
		src: chrome.extension.getURL('connectors/v2/vk-dom-inject.js'),
	}));
	$(window).on('message', (event) => {
		let eventType = event.originalEvent.data.type;
		if (typeof eventType !== 'string') {
			return;
		}
		if (eventType.startsWith('vk:player')) {
			if (eventType.endsWith('start')) {
				isPlaying = true;
			} else if (eventType.endsWith('stop') || eventType.endsWith('pause')) {
				isPlaying = false;
			}
			Connector.onStateChanged();
		}
	});
})();

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

Connector.getUniqueID = function() {
	updateTrackInfo();
	return trackInfo[INFO_ID];
};

Connector.isPlaying = function() {
	return isPlaying;
};
