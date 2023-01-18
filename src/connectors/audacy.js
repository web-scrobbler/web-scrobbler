'use strict';

const audioPlayer = 'div[aria-label="Audio player"]';
const buttonFullscreen = 'button[aria-label="Open full-screen player"]';

Connector.playerSelector = '#root'; // player not in DOM until initiated by user

Connector.trackSelector = `${audioPlayer} ${buttonFullscreen} span:first-of-type`;

Connector.artistSelector = `${audioPlayer} ${buttonFullscreen} span:nth-of-type(2)`;

Connector.getArtist = () => {
	const artistStationText = Util.getTextFromSelectors(Connector.artistSelector);

	if (artistStationText === null) {
		return null;
	}

	return artistStationText.split(' • ')[0];
};

Connector.trackArtSelector = `${audioPlayer} ${buttonFullscreen} img`;

Connector.isTrackArtDefault = (url) => url.includes('base64');

Connector.isPlaying = () => {
	const buttonPlaying = Util.getTextFromSelectors(`${audioPlayer} > div:first-of-type > div:nth-of-type(2) > button:not([aria-label=Like]) svg title`);
	return buttonPlaying === 'Stop' || buttonPlaying === 'Pause';
};

Connector.isScrobblingAllowed = () => {
	return (
		Connector.getArtist() && !Connector.getArtist().includes('Audacy') &&
		Connector.getTrack() && !Connector.getTrack().includes('Advertisement') &&
		Connector.getArtist() !== Connector.getTrack()
	);
};
