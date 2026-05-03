export {};

Connector.playerSelector = '#tracks-container';

Connector.getArtistTrack = () => {
	const trackElement = document.querySelector(
		'div[data-playing="true"] span',
	);
	return trackElement
		? Util.splitArtistTrack(trackElement.textContent)
		: null;
};

Connector.isPlaying = () => {
	const currentTrack = document.querySelector('div[data-playing="true"]');
	const svg = currentTrack?.querySelector('svg');
	return svg?.getAttribute('aria-label') === 'pause';
};

setInterval(Connector.onStateChanged, 1000);
