'use strict';

Connector.playerSelector = '#qtmplayer';

Connector.artistSelector = '.qtmplayer__songdata .qtmplayer__artist';

Connector.trackSelector = '.qtmplayer__songdata .qtmplayer__title';

Connector.isPlaying = () => Util.hasElementClass('#qtmplayerNotif', 'playing');

Connector.isScrobblingAllowed = () => {
	const stationID = 'Indie 102.3';
	return (
		!Connector.getTrack().includes(stationID) &&
		!Connector.getArtist().includes(stationID) &&
		!Connector.getArtist().startsWith('with ')
	);
};
