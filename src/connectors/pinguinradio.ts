export {};

const trackInfoSelector = '.stream-title';
const playButtonSelector = '.playbutton .material-icons';

Connector.playerSelector = '.audio-player';

Connector.getArtistTrack = () => {
	const trackInfoElement = document.querySelector(trackInfoSelector);
	if (!trackInfoElement) {
		return null;
	}

	const [trackElement, , artistElement] = trackInfoElement.childNodes;
	return {
		artist: artistElement && artistElement.textContent,
		track: trackElement && trackElement.textContent,
	};
};

Connector.isPlaying = () => {
	const playButton = document.querySelector(playButtonSelector);
	if (playButton) {
		return playButton.textContent?.includes('pause');
	}

	return true;
};
