export {};

Connector.playerSelector = '#lunaradio';

Connector.pauseButtonSelector = '.lunaradiopauseicon';

Connector.getArtistTrack = () => {
	const artistTrack = document.querySelector(
		'#lunaradio span[style*="font-size: 39px"]',
	)?.textContent;

	return artistTrack ? Util.splitArtistTrack(artistTrack) : null;
};

Connector.isPlaying = () => {
	const pauseDiv = document
		.querySelector('.lunaradiopauseicon')
		?.closest('div');

	if (!pauseDiv) {
		return false;
	}

	const opacity = Number.parseFloat(getComputedStyle(pauseDiv).opacity);

	return opacity > 0;
};
