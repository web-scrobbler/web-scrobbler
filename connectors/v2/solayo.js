'use strict';

/* global Connector */

Connector.playerSelector = '#plHelpers';

Connector.trackArtImageSelector = '.scImage';

Connector.artistTrackSelector = '.videoTitle.noColorLink';

Connector.getArtistTrack = function () {
	var text = $(Connector.artistTrackSelector).text();

	if (text.match(/ - /g).length === 2) {
		var arr = text.split(' - ');
		return {artist: arr[1], track: arr[2]};
	}

	return Connector.splitArtistTrack(text);
};

Connector.isPlaying = function () {
	return $('.play').hasClass('pause');
};
