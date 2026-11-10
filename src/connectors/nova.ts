export {};

Connector.playerSelector = '#audio_player';

Connector.isPlaying = () => Util.isElementVisible('#player-pause-btn');

Connector.getArtistTrack = () =>
	Util.splitArtistTrack(Util.getTextFromSelectors('.current-track.title'));
