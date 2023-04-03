export {};

Connector.playerSelector = '#player-logo';

Connector.artistTrackSelector = '#track';

Connector.isPlaying = () =>
	Util.getCSSPropertyFromSelectors('#player-control-playing', 'display') ===
	'inline';
