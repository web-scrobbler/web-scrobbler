'use strict';

/* global Connector, YoutubeFilter */

window.SC_ATTACHED = window.SC_ATTACHED || false;
var artist, track, duration,
	uniqueID, artwork_url,
	is_playing = false;

Connector.getArtist = function () {
	return artist;
};

Connector.getTrack = function () {
	return track;
};

Connector.getDuration = function () {
	return duration;
};

Connector.isPlaying = function () {
	return is_playing;
};

Connector.getUniqueID = function () {
	return uniqueID || null;
};

Connector.getTrackArt = function () {
	return artwork_url || null;
};

Connector.filter = YoutubeFilter;
/**
 * parse metadata and set local variables
 */
var setSongData = function (metadata) {
	// Sometimes the artist name is in the track title.
	// e.g. Tokyo Rose - Zender Overdrive by Aphasia Records.
	/*jslint regexp: true*/
	var regex = /(.+)\s?[\-–:]\s?(.+)/,
		match = regex.exec(metadata.title);
	/*jslint regexp: false*/

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
};

/**
 * Run at initialisation; add dom script and attach events.
 */
(function () {
	// Exit if already attached.
	if (window.SC_ATTACHED) {
		return;
	}

	// Inject script to extract events from the Soundcloud API event-bus.
	var s = document.createElement('script');
	s.src = chrome.extension.getURL('connectors/v2/soundcloud-dom-inject.js');
	s.onload = function () {
		this.parentNode.removeChild(this);
	};
	(document.head || document.documentElement).appendChild(s);

	// Trigger functions based on message type.
	function eventHandler(e) {
		switch (e.data.type) {
			case 'SC_PLAY':
				// don't scrobble private tracks
				if (e.data.metadata.sharing && e.data.metadata.sharing === 'private') {
					console.log('Track is private so it won\'t be scrobbled.');
					return;
				}
				is_playing = true;
				// parse metadata and set local variables
				setSongData(e.data.metadata);
				// cause connector base to read the new variable values
				Connector.onStateChanged();
				break;
			case 'SC_PAUSE':
				is_playing = false;
				Connector.onStateChanged();
				break;
			default:
				break;
		}
	}

	// Attach listener for message events.
	window.addEventListener('message', eventHandler);
	window.SC_ATTACHED = true;

}());
