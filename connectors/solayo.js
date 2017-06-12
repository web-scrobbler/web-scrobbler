'use strict';

/* global Connector, Util */

Connector.playerSelector = '#plHelpers';

Connector.trackArtSelector = '.scImage';

Connector.artistTrackSelector = '.videoTitle.noColorLink';

Connector.getArtistTrack = function () {
	var text = $(Connector.artistTrackSelector).text();

	if (text.match(/ - /g).length === 2) {
		var arr = text.split(' - ');
		return {artist: arr[1], track: arr[2]};
	}

	return Util.splitArtistTrack(text);
};

Connector.isPlaying = function () {
	return $('.play').hasClass('pause');
};
