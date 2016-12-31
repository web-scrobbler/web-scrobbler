'use strict';

/* global Connector, MetadataFilter */

let trackInfo = {};
let isPlaying = false;

(function () {
	$(document.documentElement).append($('<script>', {
		src: chrome.extension.getURL('connectors/v2/vk-dom-inject.js'),
	}));
	$(window).on('message', ({originalEvent: event}) => {
		if (event.data.sender !== 'web-scrobbler') {
			return;
		}
		switch (event.data.type) {
		case 'start':
			isPlaying = true;
			break;
		case 'stop':
		case 'pause':
			isPlaying = false;
			break;
		}
		trackInfo = event.data.trackInfo;
		Connector.onStateChanged();
	});
})();

Connector.filter = new MetadataFilter({
	all: [MetadataFilter.decodeHtmlEntities, MetadataFilter.trim]
});

Connector.getArtistTrack = function () {
	return trackInfo.artistTrack;
};

Connector.getCurrentTime = function () {
	return trackInfo.currentTime;
};

Connector.getDuration = function () {
	return trackInfo.duration;
};

Connector.getUniqueID = function() {
	return trackInfo.uniqueID;
};

Connector.isPlaying = function() {
	return isPlaying;
};
