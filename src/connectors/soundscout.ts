export {};

Connector.playerSelector = '[data-testid="player-bar"]';

Connector.playButtonSelector =
	'[data-testid="btn-player-bar-play"][aria-label="Play"]';
Connector.pauseButtonSelector =
	'[data-testid="btn-player-bar-play"][aria-label="Pause"]';

Connector.trackSelector = '[data-testid="player-bar-track-title"]';
Connector.artistSelector = '[data-testid="player-bar-track-artist"]';

Connector.trackArtSelector = `${Connector.playerSelector} [class*="TrackCover-"][class*="__image"]`;

Connector.currentTimeSelector = '[data-testid="player-bar-elapsed"]';
Connector.durationSelector = '[data-testid="player-bar-duration"]';
