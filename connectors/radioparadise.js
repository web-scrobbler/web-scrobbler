'use strict';

/* global Connector */

Connector.playerSelector = '#header';
Connector.artistTrackSelector = '#nowplaying_title > b';
Connector.trackArtImageSelector = '#nowplaying_title > img';
Connector.isPlaying = function() {
	return $('#play_button').hasClass('button_active');
};
