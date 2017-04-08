'use strict';

/* global Connector */

Connector.playerSelector = '#row-player-controls';

Connector.artistTrackSelector = '.title-container .title';

Connector.isPlaying = function () {
	return $('#ctl-play .icon').hasClass('icon-stop');
};
