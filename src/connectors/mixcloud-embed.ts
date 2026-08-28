export {};

const playerSelector = '[data-testid=widgetTopClass]';
const playButtonSelector = '[data-testid=widget-play-button]';
const trackSelector = `${playerSelector} span > strong:has(+ span)`;
const artistSelector = `${trackSelector} + span > span:last-of-type`;

Connector.playerSelector = playerSelector;

Connector.isPodcast = () =>
	Boolean(!Util.isElementVisible([artistSelector, trackSelector]));

Connector.getTrackInfo = () => {
	const showSelector = `${playButtonSelector} + div > a`;
	const trackArtSelector = '[data-testid=widget-cloudcast-image] img';
	const currentTimeSelector = '[data-testid=widget-current-time]';
	const remainingTimeSelector = `${currentTimeSelector} ~ span > span`;
	let artist = Util.getTextFromSelectors(artistSelector);
	let track = Util.getTextFromSelectors(trackSelector);
	let trackArt;
	let currentTime;
	let duration;

	if (Connector.isPodcast()) {
		artist = Util.getTextFromSelectors(
			`${showSelector} + div > a:first-of-type`,
		);
		track = Util.getTextFromSelectors(showSelector);
		trackArt = Util.extractImageUrlFromSelectors(trackArtSelector)?.replace(
			/(?<=\/)\d+x\d+(?=\/)/,
			'360x360', // larger image
		);
		currentTime = Util.getSecondsFromSelectors(currentTimeSelector);
		duration =
			(currentTime ?? 0) -
			(Util.getSecondsFromSelectors(remainingTimeSelector) ?? 0);
	}

	return { artist, track, trackArt, currentTime, duration };
};

Connector.isPlaying = () =>
	Boolean(
		Util.getAttrFromSelectors(playButtonSelector, 'style')?.includes(
			'backgroundPosition: -18.75rem', // pause icon sprite position
		),
	);
