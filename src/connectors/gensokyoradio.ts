export {};

let isPlaying = false;

Connector.playerSelector = '#heroMain';

Connector.artistSelector = '#playerArtist';

Connector.trackSelector = '#playerTitle';

Connector.albumSelector = '#playerAlbum';

Connector.albumArtistSelector = '#playerCircle';

Connector.trackArtSelector = '#playerArt';

Connector.timeInfoSelector = '#playerCounter';

Connector.isPlaying = () => isPlaying;

Connector.isTrackArtDefault = (trackArtUrl) => {
	return (
		!!trackArtUrl &&
		/(gr-logo-placeholder|no-albumart)\.png$/i.test(trackArtUrl)
	);
};

Connector.onScriptEvent = (event) => {
	isPlaying = !!event.data.isPlaying;

	Connector.onStateChanged();
};

Connector.injectScript('connectors/gensokyoradio-dom-inject.js');
