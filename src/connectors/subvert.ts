export {};

const player = '[class*=globalPlayerContainer]';
const artistSelector = `${player} .globalPlayerCoverImage > div:nth-child(2) > a:nth-child(2)`;
const trackSelector = `${player} .globalPlayerCoverImage > div:nth-child(2) > a:nth-child(1)`;
const trackArtSelector = `${player} .globalPlayerCoverImage > div:nth-child(1) img`;
const desktopDurationSelector = `${player} div:nth-child(4) > div:nth-child(4)`;
const desktopCurrentTimeSelector = `${player} div:nth-child(4) > div:nth-child(2)`;

Connector.playerSelector = player;

Connector.playButtonSelector = `${player} .playPauseButton`;

Connector.durationSelector = desktopDurationSelector;

Connector.currentTimeSelector = desktopCurrentTimeSelector;

Connector.getArtistTrack = () => {
	let track = Util.getTextFromSelectors(trackSelector);
	let artist = Util.getTextFromSelectors(artistSelector);
	if (track) {
		track = track.split('\n')[0].trim();
	}
	let titleParts = document.title.split('–');
	if (!artist && titleParts.length === 3) {
		artist = titleParts[1].trim();
	}
	return { artist, track };
};

Connector.getTrackArt = () => {
	const trackArtUrl = Util.extractImageUrlFromSelectors(trackArtSelector);
	if (trackArtUrl) {
		return trackArtUrl.replace('-50h.', '-600h.');
	}

	return null;
};

Connector.isPlaying = () => {
	let svgPlayPause = document.querySelector(
		`${Connector.playButtonSelector} svg`,
	);
	let height = svgPlayPause?.getAttribute('height');
	let playingHeight = '32';
	let pauseHeight = '24';
	if (
		!svgPlayPause ||
		!height ||
		(height !== playingHeight && height !== pauseHeight)
	) {
		return null;
	}
	if (height === playingHeight) {
		return true;
	} else {
		return false;
	}
};

Connector.getOriginUrl = () => {
	let link = document.querySelector(trackSelector) as HTMLAnchorElement;
	if (link) {
		return link.href;
	}
	return null;
};
