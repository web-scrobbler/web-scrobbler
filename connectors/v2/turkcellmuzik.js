'use strict';

/* global Connector */

Connector.playerSelector = '.m-top';

Connector.artistSelector = '.album-info .artist';

Connector.trackSelector = '.album-info .album-name';

Connector.isPlaying = function () {
	return $('.play').hasClass('ng-hide');
};
