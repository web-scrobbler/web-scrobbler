'use strict';

export {};

Connector.playerSelector = '#footerPlayer';

Connector.playButtonSelector = `${Connector.playerSelector} button[data-test="play"]`;

Connector.pauseButtonSelector = `${Connector.playerSelector} button[data-test="pause"]`;

Connector.scrobblingDisallowedReason = () =>
	Util.queryElements(Connector.playButtonSelector) ? null : 'ElementMissing';

Connector.trackSelector = [
	'#nowPlaying span[data-test="now-playing-track-title"]',
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
	'#nowPlaying div.react-tabs div[class^="_currentMediaInfoContainer"] div[class^="_creditsCell"] a[href^="/album/"]',
	`${Connector.playerSelector} a[href^="/album/"]`,
];

Connector.getAlbumArtist = () => {
	const albumUrlSegments = Util.getAttrFromSelectors(
		Connector.albumSelector,
		'href',
	)?.split('/');
	const pageUrlSegments = Util.getAttrFromSelectors(
		'head meta[name="apple-itunes-app"]',
		'content',
	)?.split('/');
	if (
		'album' === albumUrlSegments?.at(-2) &&
		'album' === pageUrlSegments?.at(-2) &&
		albumUrlSegments?.at(-1) === pageUrlSegments?.at(-1)
	) {
		const albumArtistNode = document.querySelectorAll(
			'main div[class^="_detailContainer"] .artist-link a',
		);
		return Util.joinArtists(Array.from(albumArtistNode));
	}
	return null;
};

Connector.trackArtSelector = `${Connector.playerSelector} figure[data-test="current-media-imagery"] img`;

Connector.currentTimeSelector = `${Connector.playerSelector} time[data-test="current-time"]`;

Connector.durationSelector = `${Connector.playerSelector} time[data-test="duration"]`;

Connector.applyFilter(MetadataFilter.createTidalFilter());
