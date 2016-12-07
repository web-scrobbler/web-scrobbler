'use strict';

/* global Connector */

Connector.playerSelector = '#player-controller';

Connector.trackArtImageSelector = '.imgEl > img';

Connector.artistTrackSelector = '.currentSong';

Connector.isPlaying = function () {
	return $('.progressBg').width() > 0;
};
