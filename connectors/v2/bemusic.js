'use strict';

/* global Connector */

/**
 * This connector is for BeMusic music streaming engine.
 * The connector currently covers Youtubify and GrooveMP3 music services.
 */

Connector.playerSelector = '#player-controls';

Connector.artistSelector = '.current-track .info .artist-name';

Connector.trackSelector = '.current-track .info .track-name';

Connector.trackArtImageSelector = '.current-track img';

Connector.durationSelector = '.track-length';

Connector.currentTimeSelector = '.elapsed-time';

Connector.isPlaying = function() {
	return $('#player-controls .icon-pause').is(':visible');
};

Connector.getUniqueID = function() {
	try {
		let lastTrack = JSON.parse(localStorage.getItem('last-track'));
		if (lastTrack) {
			return lastTrack.value.id.toString();
		}
	} catch (e) {
	}

	return null;
};
