export {};

Connector.playerSelector = '.audioplayer__wrapper';

Connector.artistSelector = '.audioplayer-nowplaying__artist';

Connector.trackSelector = '.audioplayer-nowplaying__track';

Connector.trackArtSelector = '.audioplayer-nowplaying__image img';

Connector.isPlaying = () =>
	Util.hasElementClass(
		'.audioplayer-controls__icon',
		'audioplayer-controls__icon--pause',
	);
