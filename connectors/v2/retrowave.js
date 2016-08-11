'use strict';

/* global Connector */

Connector.playerSelector = '#player';

Connector.artistTrackSelector = '#display-title';

Connector.durationSelector = '#display-time-total';

Connector.getTrackArt = function() {
	let backgroundImage = $('#player-cover').css('background-image');
	let backgroundUrl = /url\((['"]?)(.*)\1\)/.exec(backgroundImage);
	return backgroundUrl ? backgroundUrl[2] : null;
};

Connector.isPlaying = function() {
	return !$('#player').hasClass('player_paused');
};
