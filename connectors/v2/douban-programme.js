'use strict';

/* global Connector */

Connector.playerSelector = '.pl-bgmask';

Connector.artistSelector = '.pl-artist';

Connector.trackSelector = '.song-title';

Connector.isPlaying = function () {
	return $('.icon-pause').length;
};
