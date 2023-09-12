export {};

Connector.playerSelector = '.content-wrapper';

Connector.albumSelector = '#now_playing .album';
Connector.artistSelector = '#now_playing .artist';
Connector.trackSelector = '#now_playing .title';

Connector.isPlaying = () => Util.hasElementClass('#play-button', 'active');

Connector.trackArtSelector = '#now_playing img.album-cover';

Connector.isScrobblingAllowed = () => {
	return (
		!Util.getTextFromSelectors('#now_playing .title')?.includes(
			'Listener-supported'
		) && !Connector.getArtist()?.startsWith('Commercial-Free')
	);
};
