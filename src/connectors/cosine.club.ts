export {};

Connector.playerSelector = '#tracks-container';

Connector.getArtistTrack = () => {
	const trackElement = document.querySelector(
		'div[data-playing="true"] .track-name',
	);
	return trackElement
		? Util.splitArtistTrack(trackElement.textContent)
		: null;
};

Connector.pauseButtonSelector = 'div[data-playing="true"]';
