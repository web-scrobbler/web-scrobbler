'use strict';

/* global Connector */

Connector.playerSelector = '.container';

Connector.trackArtImageSelector = '.playing .active img';

Connector.artistTrackSelector = '.sc-player.one .sc-title';

Connector.isPlaying = function () {
	return $('.sc-remote-link').hasClass('playing');
};
