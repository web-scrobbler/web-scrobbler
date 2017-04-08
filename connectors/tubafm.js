'use strict';

/* global Connector */

Connector.playerSelector = '.ui-box';

Connector.artistSelector = '.ui-box > h3';

Connector.trackSelector = '.ui-box > h2';

Connector.isPlaying = function () {
	return $('.tuba-ui > button').hasClass('play-playing');
};
