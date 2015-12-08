'use strict';

/* global Connector */

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

/**
 * Clean non-informative garbage from title
 */
function cleanArtistTrack() {
	/*jslint regexp: true*/
	// trim whitespace
	artist = artist.replace(/^\s+|\s+$/g, '');
	track = track.replace(/^\s+|\s+$/g, '');

	// Strip crap
	track = track.replace(/^\d+\.\s*/, ''); // 01.
	track = track.replace(/\s*\*+\s?\S+\s?\*+$/, ''); // **NEW**
	track = track.replace(/\s*\[[^\]]+\]$/, ''); // [whatever]
	track = track.replace(/\s*\([^\)]*version\)$/i, ''); // (whatever version)
	track = track.replace(/\s*\.(avi|wmv|mpg|mpeg|flv)$/i, ''); // video extensions
	track = track.replace(/\s*(of+icial\s*)?(music\s*)?video/i, ''); // (official)? (music)? video
	track = track.replace(/\s*\(\s*of+icial\s*\)/i, ''); // (official)
	track = track.replace(/\s*\(\s*[0-9]{4}\s*\)/i, ''); // (1999)
	track = track.replace(/\s+\(\s*(HD|HQ)\s*\)$/, ''); // HD (HQ)
	track = track.replace(/\s+(HD|HQ)\s*$/, ''); // HD (HQ)
	track = track.replace(/\s*video\s*clip/i, ''); // video clip
	track = track.replace(/\s+\(?live\)?$/i, ''); // live
	track = track.replace(/\(\s*\)/, ''); // Leftovers after e.g. (official video)
	track = track.replace(/^(|.*\s)"(.*)"(\s.*|)$/, '$2'); // Artist - The new "Track title" featuring someone
	track = track.replace(/^(|.*\s)'(.*)'(\s.*|)$/, '$2'); // 'Track title'
	track = track.replace(/^[\/\s,:;~\-]+/, ''); // trim starting white chars and dash
	track = track.replace(/[\/\s,:;~\-]+$/, ''); // trim trailing white chars and dash
	/*jslint regexp: false*/
}

/**
 * parse metadata and set local variables
 */
var setSongData = function (metadata) {
	artist = '';
	// Sometimes the artist name is in the track title.
	// e.g. Tokyo Rose - Zender Overdrive by Aphasia Records.
	/*jslint regexp: true*/
	var regex = /(.+)\s?[\-–:]\s?(.+)/,
		match = regex.exec(metadata.title);
	/*jslint regexp: false*/

	if (match) {
		artist = match[1];
		track = match[2];
	}

	// If not, use the username.
	if (artist === '') {
		artist = metadata.user.username;
		track = metadata.title;
	}

	cleanArtistTrack();

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
