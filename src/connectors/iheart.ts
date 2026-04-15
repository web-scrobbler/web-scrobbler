export {};

const playerBar = '[data-test=player-container]';
const controlBar = '[data-test=player-controls]';
const artistSelector = `${playerBar} [data-test=description-link]`;

Connector.playerSelector = playerBar;

Connector.isPodcast = () =>
	Util.isElementVisible(
		`${playerBar} [data-test=progress-bar-player-control]`,
	);

Connector.getArtistTrack = () => {
	const artist = Util.getTextFromSelectors(artistSelector);
	let trackSelector = `${playerBar} [data-test=title-link]`;

	if (Connector.isPodcast()) {
		trackSelector = `${playerBar} [data-test=subtitle-link]`;
	}

	return { artist, track: Util.getTextFromSelectors(trackSelector) };
};

Connector.getTrackArt = () => {
	const artist = Util.getTextFromSelectors(artistSelector);
	const trackArtSelector = `${playerBar} img[alt="${artist}"]`;
	const trackArtUrl = Util.extractImageUrlFromSelectors(trackArtSelector);

	return trackArtUrl?.replace(/(?<=fit%28)\d{3}%2C\d{1,3}(?=%29)/, '328%2C0'); // larger image
};

Connector.isTrackArtDefault = (url) => url?.includes('assets.streams');

Connector.isPlaying = () => {
	const playButtonSvg = `${controlBar} button[data-test=player-play-button] svg`;
	const svgLabel = Util.getAttrFromSelectors(playButtonSvg, 'aria-label');

	if (Connector.isPodcast()) {
		return svgLabel === 'Pause';
	}

	return svgLabel === 'Stop';
};
