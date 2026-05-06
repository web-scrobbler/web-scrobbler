export {};

Connector.playerSelector = '[data-testid=embed-widget-container]';

Connector.getArtist = () => {
	const tracklistArtistSelector =
		'li[class*=TracklistRow_isCurrentTrack__] h4';
	const tracklistArtistElement = document.querySelector(
		tracklistArtistSelector,
	);
	const trackArtistElements = document.querySelectorAll(
		'[class*=_metadataWrapper__] h2 a',
	);

	if (tracklistArtistElement) {
		return tracklistArtistElement?.lastChild?.textContent;
	}

	if (trackArtistElements) {
		return Util.joinArtists(Array.from(trackArtistElements));
	}

	return null;
};

Connector.trackSelector = [
	'li[class*=TracklistRow_isCurrentTrack__] h3',
	'[class^=TrackWidget_metadataWrapper__] h1',
	'[class^=EpisodeOrShowWidget_metadataWrapper__] h1',
];

Connector.isPodcast = () =>
	Boolean(
		Util.getAttrFromSelectors(Connector.playerSelector, 'class')?.includes(
			'EpisodeOrShowWidget_',
		),
	);

Connector.getTrackArt = () =>
	Util.extractUrlFromCssProperty(
		Util.getAttrFromSelectors('[data-testid=main-page]', 'style'),
	);

Connector.isTrackArtDefault = () =>
	Util.getAttrFromSelectors(
		'[class*=_spotifyLogoContainer__] a',
		'href',
	)?.includes('/playlist/');

Connector.getTrackInfo = () => {
	const albumSelector = '[class^=TrackListWidget_metadataContainer__] h1 a';
	const albumArtistSelector =
		'[class^=TrackListWidget_metadataContainer__] h2 a';
	const album = Util.getTextFromSelectors(albumSelector);
	const albumArtist = Util.getTextFromSelectors(albumArtistSelector);

	if (!Connector.isPodcast() && !Connector.isTrackArtDefault()) {
		return { album, albumArtist };
	}

	return null;
};

Connector.remainingTimeSelector = '[class*=ProgressTimer_actualProgressTime__]';

Connector.durationSelector =
	'li[class*=TracklistRow_isCurrentTrack__] [class^=TracklistRow_durationCell__]';

Connector.isPlaying = () =>
	Util.getAttrFromSelectors(
		'[class^=PlayButton_buttonWrapper___]',
		'aria-label',
	) === 'Pause';

Connector.applyFilter(MetadataFilter.createSpotifyFilter());
