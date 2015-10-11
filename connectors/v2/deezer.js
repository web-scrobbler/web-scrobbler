'use strict';

/* global Connector */

Connector.playerSelector = '#player';

Connector.getArtist = function () {
			var text = $('.player-track-artist :not(:first-child)').text().trim();
			return text || null;
		};

Connector.trackSelector = '.player-track-title';

Connector.isPlaying = function () {
	return $('.control-pause .icon-pause').length;
};
