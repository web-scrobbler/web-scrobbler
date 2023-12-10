export {};

Connector.playerSelector = '.player-container';

Connector.artistSelector = '.player__track_artist';

Connector.trackSelector = '.player__track_title';

Connector.trackArtSelector = '.cover__inner';

Connector.isPodcast = () => Util.hasElementClass('.player', 'player-podcast');

Connector.isPlaying = () =>
	Util.getAttrFromSelectors('.player__controls_button-play', 'title') ===
	'Пауза';
