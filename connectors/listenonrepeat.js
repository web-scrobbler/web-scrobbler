'use strict';

/* global Connector */

Connector.playerSelector = '.player-controls';

Connector.artistTrackSelector = '.player-controls .video-title';

Connector.playButtonSelector = '.controls > button:nth-child(4)';

Connector.isPlaying = function() {
	return $('button:contains(Pause Video)').length > 0;
};
