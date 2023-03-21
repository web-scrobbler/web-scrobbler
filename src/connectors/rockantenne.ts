export {};

Connector.playerSelector = '.l-highlight';

Connector.artistSelector = '.c-player__currentartist';

Connector.trackSelector = '.c-player__currenttitle';

Connector.isPlaying = () => {
	return Util.hasElementClass('.c-player', 'is-playing');
};

Connector.isScrobblingAllowed = () => {
	return !Connector.getArtist()?.includes('ROCK ANTENNE');
};
