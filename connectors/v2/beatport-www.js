'use strict';

/* global Connector */

Connector.playerSelector = '.player-container';

Connector.artistSelector = '.player-track-name-artist-standard .track-artist';

Connector.getTrack = function() {
	var trackName = $('.player-track-name-artist-standard .primary-title').text();
	var remixedBy = $('.player-track-name-artist-standard .remixed').text();
	if (remixedBy === 'Original Mix') {
		return trackName;
	}
	return trackName + ' (' + remixedBy + ')';
};

Connector.getUniqueID = function() {
	var trackUrl = $('.player-current-track-container a').attr('href');
	var index = trackUrl.lastIndexOf('/');
	return trackUrl.substring(index + 1);
};

Connector.isPlaying = function() {
	return $('.player-controls .play-button').hasClass('pause');
};
