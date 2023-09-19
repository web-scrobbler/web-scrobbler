export {};

Connector.playerSelector = '#conductor-wrapper';

Connector.albumSelector = '#now_playing .album';
Connector.artistSelector = '.player-bar .player-artist';
Connector.trackSelector = '.player-bar .player-title';

Connector.isPlaying = () => {
	return (
		Util.getAttrFromSelectors('#global-player mat-icon', 'title') ===
		'Pause'
	);
};

Connector.trackArtSelector = '.player-bar img.player-cover';

Connector.isScrobblingAllowed = () => {
	return (
		!Util.getTextFromSelectors('.player-bar .player-title')?.includes(
			'Listener-supported',
		) && !Connector.getArtist()?.startsWith('Commercial-Free')
	);
};
