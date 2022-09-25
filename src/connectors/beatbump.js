'use strict';

Connector.playerSelector = '.player';

Connector.trackSelector = '.now-playing-title';

Connector.artistSelector = '.now-playing-artist';

Connector.currentTimeSelector = '.progress-container .timestamp:first-child';

Connector.durationSelector = '.progress-container .timestamp:last-child';

Connector.isPlaying = () => {
	return document.querySelector('.player-btn.player-title svg use').href.baseVal === '/icons.svg#pause';
};
