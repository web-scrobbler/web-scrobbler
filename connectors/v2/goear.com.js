'use strict';

/* global Connector */

Connector.playerSelector = '#fap-meta-wrapper';

Connector.artistSelector = '#fap-current-artist';

Connector.trackSelector = '#fap-current-title';

Connector.isPlaying = function () {
	return $('#fap-play-pause').hasClass('fap-pause');
};
