'use strict';

Connector.playerSelector = '#player-logo';

Connector.artistTrackSelector = '#track';

Connector.isPlaying = () => {
	const pauseButton = document.querySelector('#player-control-playing');
	return getComputedStyle(pauseButton).display === 'inline';
};
