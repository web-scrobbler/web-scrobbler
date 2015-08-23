'use strict';

/* global Connector */

Connector.playerSelector = '.omniplayer';

Connector.isPlaying = function() {
	return $('.omniplayer').hasClass('is-playing');
};

Connector.getArtistTrack = function () {
	var artist_all = $('.omniplayer--artist').text().trim().replace(/\s+/g, ' ');
	var artist_first = $('.omniplayer--artist a:nth-child(1)').text().trim();

	var track_clean = $('.omniplayer--title').clone().children().remove().end().text().trim();
	var track_mix = $('.omniplayer--title').clone().children().text().trim();
	var trackmix = track_clean + ' (' + track_mix + ')';

	/* this is remix tracks, like:
	 * [ Artist1, Artist2 - Trackname <Artist2 remix> ]
	 * return first artist and track with mix mark
	 */
	var artist = artist_first || null;
	var track = trackmix || null;

	/* this is normal track, like:
	 * [ Artist1, Artist2 - Trackname <Original Mix> ]
	 * return all artists and track without mix mark
	 */
	if (track_mix == 'Original Mix') {
		artist = artist_all || null;
		track = track_clean || null;
	}

	return {artist: artist, track: track};
};

Connector.trackArtImageSelector = '.omniplayer--control img:nth-child(1)';
