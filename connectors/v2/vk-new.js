'use strict';

/* global Connector */

Connector.playerSelector = '#top_audio_player';

Connector.getArtist = function() {
	return $('[data-is-current="1"]').data('audio')[4];
};

Connector.getTrack = function() {
	return $('[data-is-current="1"]').data('audio')[3];
};

Connector.getDuration = function() {
	return $('[data-is-current="1"]').data('audio')[5];
};

Connector.isPlaying = function() {
	return $('#top_audio_player').hasClass('top_audio_player_playing');
};
