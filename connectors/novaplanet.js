'use strict';

/* global Connector */

Connector.playerSelector = '.radio-radionova';

Connector.artistSelector = '.artist';

Connector.trackSelector = '.ontheair-text .title';

Connector.isPlaying = function () {
	return $('.btn_pause').is(':visible');
};
