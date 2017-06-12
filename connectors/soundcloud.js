'use strict';

/* global Connector, MetadataFilter, Util */

window.SC_ATTACHED = window.SC_ATTACHED || false;
var artist;
var track;
var duration;
var uniqueID;
var artwork_url;
var isPrivate = false;

Connector.getArtist = function () {
	return artist;
};

Connector.getTrack = function () {
	return track;
};

Connector.playerSelector = '.playControls';
const progressSelector = '.playControls div[role=progressbar]';
const playButtonSelector = '.playControls button.playControl';

Connector.getCurrentTime = function () {
	if (isPrivate) {
		return null;
	}
	return parseFloat($(progressSelector).attr('aria-valuenow')) / 1000;
};

Connector.getDuration = function () {
	return duration;
};

Connector.isPlaying = function () {
	if (isPrivate) {
		return false;
	}
	return $(playButtonSelector).hasClass('playing');
};

Connector.getUniqueID = function () {
	return uniqueID;
};

Connector.getTrackArt = function () {
	return artwork_url;
};

Connector.filter = MetadataFilter.getYoutubeFilter();


/**
 * Parse metadata and set local variables
 * @param {Object} metadata Data received from script injected in DOM
 */
function setSongData(metadata) {
	isPrivate = metadata.sharing === 'private';

	if (isPrivate) {
		artist = null;
		track = null;
		duration = null;
		uniqueID = null;
		artwork_url = null;
		return;
	}

	// Sometimes the artist name is in the track title.
	// e.g. Tokyo Rose - Zender Overdrive by Aphasia Records.
	var regex = /(.+)\s?[\-–:]\s?(.+)/,
		match = regex.exec(metadata.title);

	// But don't interpret patterns of the form
	// "[Start of title] #1234 - [End of title]" as Artist - Title
	if (match && ! /.*#\d+.*/.test(match[1])) {
		artist = match[1];
		track = match[2];
	} else {
		artist = metadata.user.username;
		track = metadata.title;
	}

	duration = Math.floor(metadata.duration / 1000);
	// use permalink url as the unique id
	uniqueID = metadata.permalink_url;
	artwork_url = metadata.artwork_url;
}

/**
 * Run at initialisation; add dom script and attach events.
 */
(function () {
	// Exit if already attached.
	if (window.SC_ATTACHED) {
		return;
	}

	// Inject script to extract events from the Soundcloud API event-bus.
	let scriptUrl = chrome.extension.getURL('connectors/soundcloud-dom-inject.js');
	Util.injectScriptIntoDocument(scriptUrl);

	// Trigger functions based on message type.
	function eventHandler(e) {
		switch (e.data.type) {
			case 'SC_PLAY':
				setSongData(e.data.metadata);
				break;
			default:
				break;
		}
	}

	// Attach listener for message events.
	window.addEventListener('message', eventHandler);
	window.SC_ATTACHED = true;

}());
