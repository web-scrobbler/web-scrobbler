'use strict';

/* global Connector */

setupIsPlayingFunction();

Connector.playerSelector = '#row-player-controls';

Connector.artistTrackSelector = '.title-container .title';

function setupIsPlayingFunction() {
	if (isNewPlayer()) {
		Connector.isPlaying = () => {
			return $('#webplayer-region').attr('data-state') === 'playing';
		};
	} else {
		Connector.isPlaying = () => {
			return $('#ctl-play .icon').hasClass('icon-stop');
		};
	}
}

function isNewPlayer() {
	return $('#webplayer-region').length > 0;
}
