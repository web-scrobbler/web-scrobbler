export {};

Connector.playerSelector = '#qtmplayer';

Connector.artistSelector = '.qtmplayer__songdata .qtmplayer__artist';

Connector.trackSelector = '.qtmplayer__songdata .qtmplayer__title';

Connector.isPlaying = () => Util.hasElementClass('#qtmplayerNotif', 'playing');

Connector.isScrobblingAllowed = () => {
	return (
		!Util.getTextFromSelectors('.qtmplayer__songdata')?.includes(
			'Indie 102.3'
		) && !Connector.getArtist()?.startsWith('with ')
	);
};
