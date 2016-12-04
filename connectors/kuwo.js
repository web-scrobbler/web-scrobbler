'use strict';

/* global Connector */

Connector.playerSelector = '#player';

Connector.getArtist = function() {
	return $('#wp_text').attr('title').split('-')[1] || null;
};

Connector.getTrack = function() {
	return $('#wp_text').attr('title').split('-')[0] || null;
};

Connector.isPlaying = function () {
	return $('#wp_playBtn').hasClass('zan');
};

Connector.trackArtImageSelector = '#artist_Image';
