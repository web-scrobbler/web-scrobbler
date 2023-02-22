'use strict';

Connector.playerSelector = '#footerPlayer';

Connector.playButtonSelector = `${Connector.playerSelector} button[data-test="play"]`;

Connector.pauseButtonSelector = `${Connector.playerSelector} button[data-test="pause"]`;

Connector.isScrobblingAllowed = () => !!Util.queryElements(Connector.playButtonSelector);

Connector.trackSelector = ['#nowPlaying div.react-tabs__tab-panel--selected > div > div:nth-child(1) > div:nth-child(1) > wave-text:nth-child(2)', `${Connector.playerSelector} div[data-test="footer-track-title"]`];

Connector.getUniqueID = () => {
	const trackUrl = Util.getAttrFromSelectors(`${Connector.trackSelector} a`, 'href');
	if (trackUrl) {
		return trackUrl.split('/').pop();
	}
	return null;
};

Connector.artistSelector = `${Connector.playerSelector} span.artist-link`;

Connector.albumSelector = ['#nowPlaying div.react-tabs a[href^="/album/"]', `${Connector.playerSelector} a[href^="/album/"]`];

Connector.getAlbumArtist = () => {
	const albumUrl = Util.getAttrFromSelectors(Connector.albumSelector, 'href');
	const canonicalUrl = Util.getAttrFromSelectors('head link[rel="canonical"]', 'href');
	if (albumUrl && canonicalUrl && canonicalUrl.endsWith(albumUrl)) {
		return Util.getTextFromSelectors('#main .header-details .artist-link');
	}
	return null;
};

Connector.trackArtSelector = `${Connector.playerSelector} figure[data-test="current-media-imagery"] img`;

Connector.currentTimeSelector = `${Connector.playerSelector} time[data-test="current-time"]`;

Connector.durationSelector = `${Connector.playerSelector} time[data-test="duration"]`;

Connector.applyFilter(MetadataFilter.getTidalFilter());
