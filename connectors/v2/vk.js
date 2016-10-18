'use strict';

/* global Connector, MetadataFilter */

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
				updateTrackInfo();
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

Connector.filter = new MetadataFilter({
	all: [MetadataFilter.decodeHtmlEntities, MetadataFilter.trim]
});

Connector.getArtist = function () {
	return trackInfo[INFO_ARTIST];
};

Connector.getTrack = function () {
	return trackInfo[INFO_TRACK];
};

Connector.getCurrentTime = function () {
	var progress = parseFloat(localStorage.getItem('audio_v10_progress'));
	return Math.round(parseInt(trackInfo[INFO_DURATION]) * progress);
};

Connector.getDuration = function () {
	return parseInt(trackInfo[INFO_DURATION]);
};

Connector.getUniqueID = function() {
	return trackInfo[INFO_ID];
};

Connector.isPlaying = function() {
	return isPlaying;
};
