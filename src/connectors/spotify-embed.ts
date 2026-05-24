export {};

Connector.playerSelector = '[data-testid=embed-widget-container]';

Connector.pauseButtonSelector =
	'[class^=PlayButton_buttonWrapper___][aria-label=Pause]';

Connector.getArtist = () => {
	const tracklistArtistElement = document.querySelector(
		'li[class*=TracklistRow_isCurrentTrack__] h4',
	);
	const trackArtistElements = document.querySelectorAll(
		'[class*=_metadataWrapper__] h2 a',
	);

	if (tracklistArtistElement) {
		return tracklistArtistElement.lastChild?.textContent;
	}

	if (trackArtistElements) {
		return Util.joinArtists(Array.from(trackArtistElements));
	}

	return null;
};

Connector.trackSelector = [
	'li[class*=TracklistRow_isCurrentTrack__] h3',
	'[class*=_metadataWrapper__] h1',
];

Connector.getTrackArt = () =>
	Util.extractUrlFromCssProperty(
		Util.getAttrFromSelectors('[data-testid=main-page]', 'style'),
	);

Connector.isTrackArtDefault = () =>
	Boolean(
		Util.getAttrFromSelectors(
			'[class*=_spotifyLogoContainer__] a',
			'href',
		)?.match(/\/artist|playlist\//),
	);

Connector.isPodcast = () =>
	Boolean(
		Util.getAttrFromSelectors(Connector.playerSelector, 'class')?.includes(
			'EpisodeOrShowWidget_',
		),
	);

Connector.getTrackInfo = () => {
	const album = Util.getTextFromSelectors(
		'[class^=TrackListWidget_metadataContainer__] h1 a',
	);
	const albumArtist = Util.getTextFromSelectors(
		'[class^=TrackListWidget_metadataContainer__] h2 a',
	);

	if (!Connector.isPodcast() && !Connector.isTrackArtDefault()) {
		return { album, albumArtist };
	}

	return null;
};

Connector.remainingTimeSelector = '[class*=ProgressTimer_actualProgressTime__]';

Connector.durationSelector =
	'li[class*=TracklistRow_isCurrentTrack__] [class^=TracklistRow_durationCell__]';

Connector.applyFilter(MetadataFilter.createSpotifyFilter());
