export {};

Connector.playerSelector = '.swiper-intro-inner';

Connector.artistTrackSelector = '#dziesma';

Connector.pauseButtonSelector = '.amazingaudioplayer-pause';

Connector.isScrobblingAllowed = () => {
	return Connector.getArtist() !== 'Radio7';
};
