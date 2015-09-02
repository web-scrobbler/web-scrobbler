'use strict';

/* global Connector */

Connector.playerSelector = '#playerContainer';

Connector.artistTrackSelector = '#jp_playlist_1 .ovr';

Connector.isPlaying = function () {
	return $('.jp-pause').is(':visible');
};
