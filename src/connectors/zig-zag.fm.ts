export {};

Connector.playerSelector = '[data-testid="bottom-bar"]';

Connector.artistSelector =
	'[data-testid="artist-section"] a > span:last-of-type';

Connector.albumSelector = '[data-testid="current-release-title-link"]';

Connector.currentTimeSelector = '[data-testid="time-label-current"]';

Connector.durationSelector = '[data-testid="time-label-total"]';

Connector.pauseButtonSelector =
	'[data-testid="cover-click-zone"][aria-label="Pause"]';

Connector.getArtistTrack = () => {
	const raw = Util.getTextFromSelectors(
		'[data-testid="current-release-tracks-list"] [data-testid^="release-track-"]',
	);

	// drop trailing view-count text ("<1k views")
	const title = raw?.replace(/<[\d.].*$/, '').trim();
	const parsed = Util.processYtVideoTitle(title);

	// prefer Discogs artist when the YT title didn't parse cleanly
	const artist =
		Util.getTextFromSelectors(Connector.artistSelector) || parsed.artist;
	return { artist, track: parsed.track };
};

Connector.getUniqueID = () => {
	const videoUrl = Util.getAttrFromSelectors(
		'[data-testid="current-release-tracks-list"] a[href*="youtube.com/watch"]',
		'href',
	);
	return Util.getYtVideoIdFromUrl(videoUrl);
};

Connector.applyFilter(MetadataFilter.createYouTubeFilter());
