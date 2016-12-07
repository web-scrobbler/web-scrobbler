'use strict';

/* global Connector */

Connector.playerSelector = '#player_inside_wrapper';
Connector.isPlaying = function() {
	return $('#player-features').hasClass('tmn_playing');
};
Connector.artistSelector = '#track_title .artist';
Connector.trackSelector = '#track_title .title';
Connector.currentTimeSelector='#player-features .sm2_position';
Connector.getDuration = function() {
	return Connector.stringToSeconds($('#player-features .sm2_total').text()) || null;
};
