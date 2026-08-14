export {};

Connector.playerSelector = '[data-sidebar-collapsed][data-player-active]';

Connector.artistSelector = '[data-testid="player-bar-track-artist"]';

Connector.trackSelector = '[data-testid="player-bar-track-title"]';

Connector.durationSelector = '[data-testid="player-bar-duration"]';

Connector.isPlaying = () =>
	Util.getAttrFromSelectors(
		'[data-testid="btn-player-bar-play"]',
		'aria-label',
	) === 'Pause';
