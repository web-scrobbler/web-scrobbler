'use strict';

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

/**
 * Regular expression used to split artist and track.
 * There're three different '-' chars in the regexp:
 * hyphen (0x2d), en dash (0x2013), em dash (0x2014).
 * @type {RegExp}
 */
const artistTrackRe = /(.+)\s[-–—:]\s(.+)/;

Connector.playerSelector = '.playControls';

Connector.getCurrentState = () => {
	currentState.currentTime = Connector.getCurrentTime();
	currentState.isPlaying = Connector.isPlaying();
	return currentState;
};

Connector.isScrobblingAllowed = () => !isPrivate;

Connector.filter = MetadataFilter.getYoutubeFilter();

Connector.getCurrentTime = () => {
	return parseFloat($(progressSelector).attr('aria-valuenow')) / 1000;
};

Connector.isPlaying = () => {
	return $(playButtonSelector).hasClass('playing');
};

/**
 * Parse metadata and set local letiables
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
	let match = artistTrackRe.exec(metadata.title);

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

Connector.onScriptEvent = (e) => {
	switch (e.data.type) {
		case 'SC_PLAY':
			setSongData(e.data.metadata);
			break;
		default:
			break;
	}
};

Connector.injectScript('connectors/soundcloud-dom-inject.js');
