import type { ArtistTrackInfo } from '@/core/types';

export {};

const playerBar = '[data-test=player-container]';
const controlBar = '[data-test=player-controls]';
const artistSelector = `${playerBar} [data-test=description-link]`;
let artistTrack: ArtistTrackInfo | null = null;
let timeout: ReturnType<typeof setTimeout> | undefined;

Connector.playerSelector = playerBar;

Connector.isPodcast = () =>
	Util.isElementVisible(`${playerBar} [data-test=forward-30-player-button]`);

Connector.getArtistTrack = () => {
	const newArtistTrack = getArtistTrack();

	if (!Util.isArtistTrackEmpty(newArtistTrack)) {
		artistTrack = newArtistTrack;
		renewTimeout();
	}

	return artistTrack;
};

Connector.currentTimeSelector = `${playerBar} span:has(~ [data-test=progress-bar-player-control])`;

Connector.durationSelector = `${playerBar} [data-test=progress-bar-player-control] ~ span`;

Connector.getTrackArt = () => {
	const artist = Util.getTextFromSelectors(artistSelector);
	const trackArtSelector = `${playerBar} img[alt="${artist}"]`;
	const trackArtUrl = Util.extractImageUrlFromSelectors(trackArtSelector);

	return trackArtUrl?.replace(/(?<=fit%28)\d{3}%2C\d{1,3}(?=%29)/, '400%2C0'); // larger image
};

Connector.isTrackArtDefault = (url) => url?.includes('assets');

Connector.isPlaying = () => {
	const playButtonSvg = `${controlBar} [data-test=player-play-button] svg`;
	const svgLabel = Util.getAttrFromSelectors(playButtonSvg, 'aria-label');

	if (Util.isElementVisible(`${controlBar} [data-test=next-player-button]`)) {
		return svgLabel === 'Pause'; // podcasts and playlists
	}

	return svgLabel === 'Stop';
};

function getArtistTrack() {
	const artist = Util.getTextFromSelectors(artistSelector);
	let trackSelector = `${playerBar} [data-test=title-link]`;

	if (Connector.isPodcast()) {
		trackSelector = `${playerBar} [data-test=subtitle-link]`;
	}

	const track = Util.getTextFromSelectors(trackSelector)?.replace('•', '-');

	return { artist, track };
}

function renewTimeout() {
	clearTimeout(timeout);
	timeout = setTimeout(() => {
		artistTrack = null;
		Connector.onStateChanged();
	}, 10000); // 10 second delay to mitigate frequent empty state on some stations
}
