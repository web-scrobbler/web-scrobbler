export {};
// https://github.com/web-scrobbler/web-scrobbler/blob/master/src/core/content/connector.ts
const player = '[class*=globalPlayerContainer]';
//`${player} div:nth-child(3)` === album info
const artistSelector = `${player} .globalPlayerCoverImage > div:nth-child(2) > a:nth-child(2)`;
const trackSelector = `${player} .globalPlayerCoverImage > div:nth-child(2) > a:nth-child(1)`;
const trackArtSelector = `${player} .globalPlayerCoverImage > div:nth-child(1) img`;
const desktopDurationSelector = `${player} div:nth-child(4) > div:nth-child(4)`;
const desktopCurrentTimeSelector = `${player} div:nth-child(4) > div:nth-child(2)`;
// const mobileProgressSelector = ;

Connector.playerSelector = player;

Connector.playButtonSelector = `${player} .playPauseButton`;

function parseTime(timeSelector: string): number | undefined {
	const timeString = document.querySelector(timeSelector) as HTMLElement;

	if (!timeString) {
		return undefined;
	}

	let timeParts = timeString.innerText.split(':');
	let timeInSeconds = timeParts.reduce((acc, number, index) => {
		let parsedNum = 0;
		let mult = 60;
		let finalNum = 0;
		if (Number.isNaN(Number(number))) {
			return acc;
		} else {
			parsedNum = Number(number.trim());
		}
		if (index === 0 && timeParts.length === 3) {
			// account for hours
			finalNum = parsedNum * mult * mult;
		} else if (
			(index === 1 && timeParts.length === 3) ||
			(index === 0 && timeParts.length === 2)
		) {
			// account for minutes
			finalNum = parsedNum * mult;
		} else {
			finalNum = parsedNum;
		}
		return acc + finalNum;
	}, 0);

	return timeInSeconds;
}

Connector.getCurrentTime = () => {
	return parseTime(desktopCurrentTimeSelector);
};

Connector.getDuration = () => {
	return parseTime(desktopDurationSelector);
};

Connector.getArtistTrack = () => {
	let track = Util.getTextFromSelectors(trackSelector);
	let artist = Util.getTextFromSelectors(artistSelector);

	let titleParts = document.title.split('–');
	if (!artist && titleParts.length === 3) {
		// album = titleParts[0].trim();
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
