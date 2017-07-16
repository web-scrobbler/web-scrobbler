'use strict';

Connector.playerSelector = '#player';

Connector.playButtonSelector = '.player-center [aria-labelledby="play"]';

Connector.artistSelector = '.player-artist';

Connector.trackSelector = '.player-song-text';

Connector.isStateChangeAllowed = () => {
	let track = Connector.getTrack();
	if (track) {
		return !track.startsWith('Thanks for listening to');
	}
	return false;
};
