'use strict';

/* global Connector */

Connector.playerSelector = '#playbackControl';

Connector.trackArtImageSelector = '.playerBarArt';

Connector.albumSelector = 'a.playerBarAlbum';

Connector.artistSelector = 'a.playerBarArtist';

Connector.trackSelector = 'a.playerBarSong';

/** At the end of a song, currentTime becomes 0:00 for a brief time before
    changing to the next song. If currentTimeSelector is used, controller
    treats the reset like a rewind and an extra notification is displayed. */
//Connector.currentTimeSelector = 'div.elapsedTime';

Connector.playButtonSelector = 'div.playButton';

/** @returns {number|null} track length in seconds */
Connector.getDuration = function () {
	var elapsed = Connector.stringToSeconds($('div.elapsedTime').text() || ''),
		remaining = Connector.stringToSeconds($('div.remainingTime').text().split('-')[1] || '');
	return elapsed + remaining;
};
