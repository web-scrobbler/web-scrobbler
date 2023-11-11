export {};

Connector.playerSelector = '.header-tools';

Connector.artistSelector = '.AudioPlayer-content > .subtitle';

Connector.trackSelector = '.AudioPlayer-content > .title';

Connector.isPlaying = () =>
	Util.hasElementClass('.toggle-play.player-button', 'pause');

Connector.isStateChangeAllowed = () =>
	Connector.getArtist() !== 'Voice message';
