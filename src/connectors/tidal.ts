'use strict';

Connector.playerSelector = '#footerPlayer';

Connector.playButtonSelector = `${Connector.playerSelector} button[data-test="play"]`;

Connector.pauseButtonSelector = `${Connector.playerSelector} button[data-test="pause"]`;

Connector.scrobblingDisallowedReason = () =>
	Util.queryElements(Connector.playButtonSelector) ? null : 'ElementMissing';

Connector.trackSelector = [
	'#nowPlaying div.react-tabs__tab-panel--selected > div > div:nth-child(1) > div:nth-child(1) > .wave-text-description-medium',
	`${Connector.playerSelector} div[data-test="footer-track-title"]`,
];

Connector.getUniqueID = () => {
	const trackUrl = Util.getAttrFromSelectors(
		`${Connector.trackSelector?.toString()} a`,
		'href',
	);
	if (trackUrl) {
		return trackUrl.split('/').at(-1);
	}
	return null;
};

const artistSelector = `${Connector.playerSelector} span.artist-link a`;

Connector.getArtist = () => {
	const artistNodes = document.querySelectorAll(artistSelector);
	return Util.joinArtists(Array.from(artistNodes));
};

Connector.albumSelector = [
	'#nowPlaying div.react-tabs a[href^="/album/"]',
	`${Connector.playerSelector} a[href^="/album/"]`,
];

Connector.getAlbumArtist = () => {
	const albumUrl = Util.getAttrFromSelectors(Connector.albumSelector, 'href');
	const canonicalUrl = Util.getAttrFromSelectors(
		'head link[rel="canonical"]',
		'href',
	);
	if (albumUrl && canonicalUrl && canonicalUrl.endsWith(albumUrl)) {
		const albumArtistNode = document.querySelectorAll(
			'#main .header-details .artist-link a',
		);
		return Util.joinArtists(Array.from(albumArtistNode));
	}
	return null;
};

Connector.trackArtSelector = `${Connector.playerSelector} figure[data-test="current-media-imagery"] img`;

Connector.currentTimeSelector = `${Connector.playerSelector} time[data-test="current-time"]`;

Connector.durationSelector = `${Connector.playerSelector} time[data-test="duration"]`;

Connector.applyFilter(MetadataFilter.createTidalFilter());
