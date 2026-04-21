'use strict';

export {};

Connector.playerSelector = '#footerPlayer';

Connector.playButtonSelector = `${Connector.playerSelector} button[data-test="play"]`;

Connector.pauseButtonSelector = `${Connector.playerSelector} button[data-test="pause"]`;

Connector.scrobblingDisallowedReason = () =>
	Util.queryElements(Connector.playButtonSelector) ? null : 'ElementMissing';

Connector.trackSelector = `${Connector.playerSelector} div[data-test="footer-track-title"]`;

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

const artistSelector = `${Connector.playerSelector} a[data-test="grid-item-detail-text-title-artist"]`;
const albumArtistSelector = `${artistSelector}:first-child`;

Connector.getArtist = () => {
	const artistNodes = document.querySelectorAll(artistSelector);
	return Util.joinArtists(Array.from(artistNodes));
};

Connector.albumSelector = `${Connector.playerSelector} a[href^="/album/"]`;

Connector.getAlbumArtist = () => {
	const albumArtistNode = document.querySelectorAll(albumArtistSelector);
	return Util.joinArtists(Array.from(albumArtistNode));
};

Connector.trackArtSelector = `${Connector.playerSelector} figure[data-test="current-media-imagery"] img`;

Connector.currentTimeSelector = `${Connector.playerSelector} time[data-test="current-time"]`;

Connector.durationSelector = `${Connector.playerSelector} time[data-test="duration"]`;

Connector.applyFilter(MetadataFilter.createTidalFilter());
