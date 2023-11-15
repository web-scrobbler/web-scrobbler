export {};

Connector.playerSelector = '.radio-player-top__left, .player__player';

Connector.artistSelector = '.js-current-track-artist';

Connector.trackSelector = '.js-current-track-title';

Connector.artistTrackSelector = '.js-current-track';

Connector.trackArtSelector = '.js-current-track-artwork';

Connector.isTrackArtDefault = (url) => url?.includes('no-artwork');

Connector.isPlaying = () =>
	Util.hasElementClass('.js-play-button .fas', 'fa-stop');
