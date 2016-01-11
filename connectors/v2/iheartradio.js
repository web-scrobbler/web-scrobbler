'use strict';

/* global Connector */

Connector.playerSelector = '.player-info';
Connector.playButtonSelector = '.player-controls .play';
Connector.durationSelector = '.player-duration-duration';

Connector.isPlaying = function() {
  if ($('.player-controls .icon-play').length == 1) {
    return false;
    } else {
    return true;
  }
};

Connector.getTrackArt = function () {
  return 'http:'+$('.player-left .player-art img').attr('src');
};

Connector.getArtist = function () {
  return $('.player-left .player-artist').text() ||
		$('.player-left .player-artist').attr('title') || null;
};

Connector.getTrack = function() {
	return $('.player-left .player-song').text() ||
		$('.player-left .player-song').attr('title') || null;
};

Connector.getUniqueID = function() {
	return $('.player-left .player-song').attr('href');
};

Connector.getCurrentTime = function () {
  return $('.player-duration-position').text();
};
