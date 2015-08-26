'use strict';

/* global Connector */

Connector.playerSelector = '.music-player-block';

Connector.getTrack = function() {
	return $('.media-title-artist > a').text().replace(/ by .*/, '') || null;
};

Connector.artistSelector = '.media-title-track > a';

Connector.currentTimeSelector = '.timecode.ng-scope > span:nth-child(1)';

Connector.trackArtImageSelector = '.music-player-artistimg';

Connector.isPlaying = function() {
	return ($('.edm-player-control-play').attr('class').indexOf('flaticon-pause') > -1) ? true : false;
};
