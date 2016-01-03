'use strict';

/* global Connector */

Connector.playerSelector = '#app-player';

Connector.currentTimeSelector = '.hidden-xs > .js-player-position';

Connector.durationSelector = '.hidden-xs > .js-player-duration';

Connector.playButtonSelector = '.js-player-play-pause > .icon-play';

Connector.getArtist = function () {
	var text = $('.player-mini_track_information_artist').text();
	return $.trim(text);
};

Connector.getTrack = function () {
	var text = $('.player-mini_track_information_title').text();
	return $.trim(text);
};
