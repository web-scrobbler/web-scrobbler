export {};

Connector.playerSelector = '#site-header';

Connector.getArtist = () => {
	return 'King Gizzard & The Lizard Wizard';
};

Connector.trackSelector =
	'#now-playing > #now-playing-track-title';

Connector.albumSelector =
	'#now-playing > #now-playing-show-date';

Connector.durationSelector = '#now-playing > .now-playing-duration';

Connector.currentTimeSelector =	'#now-playing > .now-playing-elapsed';

Connector.isPlaying = () => {
	return document
		.querySelector('#play-btn')
		?.classList.contains('is-playing');
};
