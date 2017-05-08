'use strict';

/* global Connector */

Connector.playerSelector = '#player';

Connector.artistTrackSelector = '.player-current-title';

Connector.getArtistTrack = function() {
	var text = $(Connector.artistTrackSelector).text();
	var m = text.match(/ - /g);
	if (m && (m.length === 2)) {
		var arr = text.split(' - ');
		return {artist: arr[1], track: arr[2]};
	}
	return Util.splitArtistTrack(text);
};

Connector.isPlaying = function () {
	return $('.player-pause').is(':visible');
};
