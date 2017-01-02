'use strict';

/* global Connector */

Connector.playerSelector = '#player';

Connector.playButtonSelector = '.player-center [aria-labelledby="play"]';

Connector.artistSelector = '.player-artist';

Connector.trackSelector = '.player-song-text';

Connector.isStateChangeAllowed = function() {
	let track = Connector.getTrack();
	if (track) {
		return !Connector.getTrack().startsWith('Thanks for listening to');
	}
	return false;
};
