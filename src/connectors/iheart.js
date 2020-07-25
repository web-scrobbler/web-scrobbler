'use strict';

const playerBar = '[data-test=player-container]';

Connector.playerSelector = playerBar;

Connector.pauseButtonSelector = `${playerBar} button[data-test-state=PLAYING]`;

Connector.artistSelector = `${playerBar} [data-test=line-text]:nth-child(3)`;

Connector.trackSelector = `${playerBar} [data-test=line-text]:nth-child(2)`;

Connector.isScrobblingAllowed = () => {
	const track = Connector.getTrack();
	return track && !track.startsWith('Thanks for listening');
};
