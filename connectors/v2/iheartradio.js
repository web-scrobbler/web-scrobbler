'use strict';

/* global Connector */

Connector.playerSelector = '#player';

Connector.playButtonSelector = '.player-controls .play';

Connector.artistSelector = '.player-artist';

Connector.trackSelector = '.player-song-text';

Connector.isPlaying = function() {
	return $('.player-controls-center .play').hasClass('playing');
};

Connector.isStateChangeAllowed = function() {
	let track = Connector.getTrack();
	if (track) {
		return !Connector.getTrack().startsWith('Thanks for listening to');
	}
	return false;
};
