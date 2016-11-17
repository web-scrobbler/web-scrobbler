'use strict';

/* global Connector, MetadataFilter */

const INFO_ID = 0;
const INFO_TRACK = 3;
const INFO_ARTIST = 4;
const INFO_DURATION = 5;

let trackInfo = null;
let progressInfo = null;
let isPlaying = false;

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
			updateTrackInfo();
			Connector.onStateChanged();
		}
	});
})();

function updateTrackInfo() {
	trackInfo = JSON.parse(localStorage.getItem('audio_v12_track'));
	progressInfo = localStorage.getItem('audio_v12_progress');
}

function getTrackInfo(field, defaultValue=null) {
	if (trackInfo) {
		return trackInfo[field];
	}

	return defaultValue;
}

Connector.filter = new MetadataFilter({
	all: [MetadataFilter.decodeHtmlEntities, MetadataFilter.trim]
});

Connector.getArtist = function () {
	return getTrackInfo(INFO_ARTIST);
};

Connector.getTrack = function () {
	return getTrackInfo(INFO_TRACK);
};

// Used as fallback
Connector.artistTrackSelector = '.top_audio_player_title';

Connector.getCurrentTime = function () {
	if (progressInfo) {
		let progressPercent = parseFloat(progressInfo);
		return Math.round(Connector.getDuration() * progressPercent);
	}

	return 0;
};

Connector.getDuration = function () {
	return parseInt(getTrackInfo(INFO_DURATION, 0));
};

Connector.getUniqueID = function() {
	return getTrackInfo(INFO_ID);
};

Connector.isPlaying = function() {
	return isPlaying;
};
