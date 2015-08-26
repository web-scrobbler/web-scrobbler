'use strict';

/* global Connector */

Connector.playerSelector = '.container';

Connector.artistTrackSelector = '.sc-player.one .sc-title';

Connector.isPlaying = function () {
	return $('.sc-remote-link').hasClass('playing');
};
