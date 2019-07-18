'use strict';

Connector.playerSelector = '[data-test="mini-player-container"]';

Connector.pauseButtonSelector = 'button[data-test-state="playing"]';

Connector.artistSelector = '[data-test="mini-player-description-text"] [title]';

Connector.trackSelector = '[data-test="mini-player-track-text"] [title]';

Connector.isScrobblingAllowed = () => {
	let track = Connector.getTrack();
	if (track) {
		return !track.startsWith('Thanks for listening');
	}
	return false;
};
