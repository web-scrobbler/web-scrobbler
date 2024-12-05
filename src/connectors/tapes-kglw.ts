export {};

Connector.playerSelector = '#site-header';

Connector.getArtist = () => {
	return 'King Gizzard & The Lizard Wizard';
};

Connector.trackSelector =
	'#site-header div#now-playing > span#now-playing-track-title';

Connector.albumSelector =
	'#site-header div#now-playing > span#now-playing-show-date';

Connector.currentTimeSelector =
	'#site-header div#now-playing > span.now-playing-elapsed';

Connector.durationSelector =
	'#site-header div#now-playing > span.now-playing-duration hidden-sm';

Connector.playButtonSelector = '#play-btn';

Connector.isPlaying = () => {
	return document
		.querySelector('#play-btn')
		?.classList.contains('is-playing');
};
