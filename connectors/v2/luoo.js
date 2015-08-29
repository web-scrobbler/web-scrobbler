'use strict';

/* global Connector */

Connector.playerSelector = '#playerCt';

Connector.artistSelector = '.track-meta .PLArtist';

Connector.trackSelector = '.trackname .PLTrackname';

Connector.isPlaying = function () {
	return $('.jp-pause').is(':visible');
};
