'use strict';

/* global Connector */

Connector.playerSelector = '#mp3Player';

Connector.getArtist = function() {
	return $('.currentSongDetails .artistLink').attr('title') || null;
};

/** prefer titles from playlist but in case user has navigated away from the playlist,
 *  fallback to the (possibly truncated) values in the bottom now playing pane.
 */
Connector.getTrack = function() {
	return $('tr.selectable.currentlyPlaying td.titleCell').attr('title') ||
		$('.currentSongDetails .title').text() || null;
};

Connector.getAlbum = function() {
	return $('tr.selectable.currentlyPlaying td.albumCell').attr('title') ||
		$('.nowPlayingDetail img.albumImage').attr('title') || null;
};

Connector.currentTimeSelector = '#currentTime';

Connector.playButtonSelector = 'span.mp3MasterPlay.icon-play';

/** @returns {number|null} track length in seconds */
Connector.getDuration = function() {
	return Connector.stringToSeconds($('#currentDuration').text()) || null;
};

Connector.getUniqueID = function() {
	var optionsHref = $('.buttonOption.main[title=Options]').attr('href');
	if (optionsHref) {
		return optionsHref.replace(/[\w|\W]+adriveId=/, '');
	}
	return null;
};
