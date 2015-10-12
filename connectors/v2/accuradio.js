'use strict';

/* global Connector */

Connector.playerSelector = '#playerContents';

Connector.artistSelector = '#songartist';

Connector.trackSelector = '#songtitle';

Connector.isPlaying = function () {
	return $('#playerPauseButton').length;
};
