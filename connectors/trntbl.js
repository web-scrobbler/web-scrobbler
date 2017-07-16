'use strict';

Connector.playerSelector = '#turntable';

Connector.isPlaying = function() {
	return $('#play-pause').hasClass('pause');
};

Connector.artistTrackSelector = '#artist-song';

Connector.currentTimeSelector = '#time-elapsed';
