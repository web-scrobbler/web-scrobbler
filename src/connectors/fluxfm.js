'use strict';

Connector.playerSelector = '.hero-player__headline';

Connector.getArtistTrack = () => {
	const artistTrack = Util.getTextFromSelectors('.hero-player__title');
	return Util.splitArtistTrack(artistTrack, null, { swap: true });
};

Connector.isPlaying = () => {
	return Util.getAttrFromSelectors('rs-play-button > rs-button > button', 'title') === 'Pausieren';
};

Connector.onReady = Connector.onStateChanged;
