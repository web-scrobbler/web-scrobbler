export {};

let isPlaying = false;

Connector.playerSelector = '#heroMain';

Connector.artistSelector = '#playerArtist';

Connector.trackSelector = '#playerTitle';

Connector.albumSelector = '#playerAlbum';

Connector.trackArtSelector = '#playerArt';

Connector.timeInfoSelector = '#playerCounter';

Connector.isPlaying = () => isPlaying;

Connector.isTrackArtDefault = (trackArtUrl) => {
	return (
		trackArtUrl == 'https://gensokyoradio.net/images/assets/no-albumart.png'
	);
};

Connector.onScriptEvent = (event) => {
	isPlaying = !!event.data.isPlaying;

	Connector.onStateChanged();
};

Connector.injectScript('connectors/gensokyoradio-dom-inject.js');
