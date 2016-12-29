'use strict';

/* global Connector */

Connector.playerSelector = '#headplayer';
Connector.currentTimeSelector = '#player-playedtime';
Connector.artistTrackSelector = '.headplayer-titleReal';

Connector.getArtistTrack = function() {
	var text = $(this.artistTrackSelector).first().text();
	return Connector.splitArtistTrack(text);
};

Connector.getDuration = function() {
	return $('audio')[0].duration;
};

Connector.isPlaying = function() {
	return $('#headplayer-play').hasClass('hidden');
};
