export {};

const audioPlayer = 'div[aria-label="Audio player"]';
const buttonOpenFullscreen = 'button[aria-label="Open full-screen player"]';
const buttonCloseFullscreen = 'button[aria-label="Close full-screen player"]';
const fullArtistTrackSelector = `${buttonCloseFullscreen} + div span`;

Connector.playerSelector = '#root'; // player not in DOM until initiated by user

Connector.getArtist = () => {
	const miniArtistStationText = Util.getTextFromSelectors(
		`${audioPlayer} ${buttonOpenFullscreen} span:nth-of-type(2)`,
	);

	if (miniArtistStationText !== null) {
		return miniArtistStationText.split(' • ')[0];
	}

	if (Util.isElementVisible(fullArtistTrackSelector)) {
		return (
			Util.getTextFromSelectors(fullArtistTrackSelector)?.split(
				' - ',
			)[1] ?? ''
		);
	}

	return null;
};

Connector.getTrack = () => {
	const miniTrackText = Util.getTextFromSelectors(
		`${audioPlayer} ${buttonOpenFullscreen} span:first-of-type`,
	);

	if (miniTrackText !== null) {
		return miniTrackText;
	}

	if (Util.isElementVisible(fullArtistTrackSelector)) {
		return Util.getTextFromSelectors(fullArtistTrackSelector)?.split(
			' - ',
		)[0];
	}

	return null;
};

Connector.trackArtSelector = [
	`${audioPlayer} ${buttonOpenFullscreen} img`,
	`${buttonCloseFullscreen} + div img`,
];

Connector.isTrackArtDefault = (url) => url?.includes('base64');

Connector.isPlaying = () => {
	const buttonSvgTitle =
		'button:not([aria-label=Like], [aria-label*=thumbs]) svg title';
	const buttonPlaying = Util.getTextFromSelectors([
		`${audioPlayer} ${buttonSvgTitle}`,
		`${buttonCloseFullscreen} + div ${buttonSvgTitle}`,
	]);
	return buttonPlaying === 'Pause' || buttonPlaying === 'Stop';
};

Connector.scrobblingDisallowedReason = () => {
	const artist = Connector.getArtist();
	const track = Connector.getTrack();

	if (!artist || !track) {
		return 'Other';
	}
	if (artist.includes('Audacy') || artist === track) {
		return 'FilteredTag';
	}
	if (track.startsWith('Advertisement')) {
		return 'IsAd';
	}
	return null;
};
