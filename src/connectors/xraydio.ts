export {};

const playerSelector =
	'#xraydio-player-st1,#xraydio-player-st2,#xraydio-player-st3';

Connector.playerSelector = playerSelector;

Connector.isPlaying = () =>
	Util.getDataFromSelectors(playerSelector, 'playstate') === 'playing';

Connector.getArtist = () =>
	Util.getDataFromSelectors(playerSelector, 'scrobble-artist');

Connector.getTrack = () =>
	Util.getDataFromSelectors(playerSelector, 'scrobble-title');
