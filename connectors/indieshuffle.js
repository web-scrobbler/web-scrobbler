'use strict';

/* global Connector */

Connector.playerSelector = '#indieshuffle_player';

Connector.getArtist = function () {
	return $('#player-current .artist').text().slice(0, -3);
};

Connector.trackSelector = '#player-current .title';

Connector.trackArtSelector = '#player-current > div > a.ajaxlink.pink > img';

Connector.currentTimeSelector = '#player-current > .progress > .seek';

Connector.durationSelector = '#player-current > .progress > .duration';

Connector.isPlaying = function () {
	return $('#playerPlaying').hasClass('active');
};
