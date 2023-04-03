export {};

Connector.playerSelector = '#player_container';

Connector.artistSelector = [
	// Radio
	'.player-title [data-name="artist-name"]',
	// Single track
	'.player-title [data-name="song-artist"]',
];

Connector.trackSelector = '[data-name="song-name"]';

Connector.isPlaying = () =>
	Util.hasElementClass('#player_container', 'jp-state-playing');
