'use strict';

/* global Connector, Util */

Connector.playerSelector = '#player';

Connector.getArtistTrack = function() {
	let artistTrack = $('#wp_text').attr('title');
	return Util.splitArtistTrack(artistTrack, null, true);
};

Connector.isPlaying = function () {
	return $('#wp_playBtn').hasClass('zan');
};

Connector.trackArtSelector = '#artist_Image';
