'use strict';

Connector.playerSelector = '[data-test="mini-player-container"]';

Connector.playButtonSelector = 'button[data-test="play-button"]';

Connector.artistSelector = '[data-test="mini-player-description-text"] [title]';

Connector.trackSelector = '[data-test="mini-player-track-text"] [title]';

Connector.isStateChangeAllowed = Connector.isPlaying = () => {
	let track = Connector.getTrack();
	if (track) {
		return !track.startsWith('Thanks for listening');
	}
	return false;
};
