'use strict';

/* global Connector, Util */

Connector.playerSelector = '#headplayer';
Connector.currentTimeSelector = '#player-playedtime';
Connector.artistTrackSelector = '.headplayer-titleReal';

Connector.getArtistTrack = function() {
	var text = $(this.artistTrackSelector).first().text();
	return Util.splitArtistTrack(text);
};

Connector.getDuration = function() {
	return $('audio')[0].duration;
};

Connector.isPlaying = function() {
	return $('#headplayer-play').hasClass('hidden');
};
