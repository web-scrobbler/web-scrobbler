'use strict';

/* global Connector */

Connector.playerSelector = '#player-controller';

Connector.trackArtSelector = '.imgEl > img';

Connector.artistTrackSelector = '.currentSong';

Connector.isPlaying = function () {
	return $('.progressBg').width() > 0;
};
