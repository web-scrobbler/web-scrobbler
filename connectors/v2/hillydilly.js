'use strict';

/* global Connector */

Connector.playerSelector = '#lennon-ui';

Connector.artistTrackSelector = '#lennon-now-playing';

Connector.isPlaying = function () {
	return $('#lennon-pause').is(':visible');
};
