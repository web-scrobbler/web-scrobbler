'use strict';

/* global Connector, MetadataFilter, Util */

window.SC_ATTACHED = window.SC_ATTACHED || false;

let currentState = {};
/**
 * Flag indicates now playing track is private.
 * The extension does not scrobble such tracks.
 * @type {Boolean}
 */
let isPrivate = false;

const progressSelector = '.playControls div[role=progressbar]';
const playButtonSelector = '.playControls button.playControl';

Connector.playerSelector = '.playControls';

Connector.getCurrentState = () => {
	currentState.currentTime = getCurrentTime();
	currentState.isPlaying = isPlaying();
	return currentState;
};

Connector.isScrobblingAllowed = () => !isPrivate;

Connector.filter = MetadataFilter.getYoutubeFilter();

function getCurrentTime() {
	return parseFloat($(progressSelector).attr('aria-valuenow')) / 1000;
}

function isPlaying() {
	return $(playButtonSelector).hasClass('playing');
}

/**
 * Parse metadata and set local variables
 * @param {Object} metadata Data received from script injected in DOM
 */
function setSongData(metadata) {
	isPrivate = metadata.sharing === 'private';

	if (isPrivate) {
		currentState = {};
		return;
	}

	// Sometimes the artist name is in the track title,
	// e.g. Tokyo Rose - Zender Overdrive by Aphasia Records.
	let regex = /(.+)\s?[\-–:]\s?(.+)/;
	let match = regex.exec(metadata.title);

	// But don't interpret patterns of the form
	// "[Start of title] #1234 - [End of title]" as Artist - Title
	if (match && ! /.*#\d+.*/.test(match[1])) {
		currentState.artist = match[1];
		currentState.track = match[2];
	} else {
		currentState.artist = metadata.user.username;
		currentState.track = metadata.title;
	}

	currentState.duration = Math.floor(metadata.duration / 1000);
	// Use permalink url as the unique id
	currentState.uniqueID = metadata.permalink_url;
	currentState.trackArt = metadata.artwork_url;
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
