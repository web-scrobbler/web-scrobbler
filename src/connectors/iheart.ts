export {};

const playerBar = '[data-test=player-container]';
const controlBar = '[data-test=player-controls]';
const artistSelector = `${playerBar} [data-test=description-link]`;

Connector.playerSelector = playerBar;

Connector.isPodcast = () =>
	Util.isElementVisible(`${playerBar} [data-test=forward-30-player-button]`);

Connector.getArtistTrack = () => {
	const artist = Util.getTextFromSelectors(artistSelector);
	let trackSelector = `${playerBar} [data-test=title-link]`;

	if (Connector.isPodcast()) {
		trackSelector = `${playerBar} [data-test=subtitle-link]`;
	}

	const track = Util.getTextFromSelectors(trackSelector);

	return { artist, track };
};

Connector.getTrackArt = () => {
	const artist = Util.getTextFromSelectors(artistSelector);
	const trackArtSelector = `${playerBar} img[alt="${artist}"]`;
	const trackArtUrl = Util.extractImageUrlFromSelectors(trackArtSelector);

	return trackArtUrl?.replace(/(?<=fit%28)\d{3}%2C\d{1,3}(?=%29)/, '400%2C0'); // larger image
};

Connector.isTrackArtDefault = (url) => url?.includes('assets.streams');

Connector.isPlaying = () => {
	const playButtonSvg = `${controlBar} button[data-test=player-play-button] svg`;
	const svgLabel = Util.getAttrFromSelectors(playButtonSvg, 'aria-label');

	if (Util.isElementVisible('[data-test=next-player-button]')) {
		return svgLabel === 'Pause'; // podcasts and playlists
	}

	return svgLabel === 'Stop';
};
