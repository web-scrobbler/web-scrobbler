'use strict';

/* global Connector */

Connector.playerSelector = '#plHelpers';

Connector.artistTrackSelector = '.videoTitle.noColorLink';

Connector.getArtistTrack = function () {
	if ($(Connector.artistTrackSelector).text().match(/ - /g).length === 2) {
		var arr = $(Connector.artistTrackSelector).text().split(' - ');
		return {artist: arr[1].trim(), track: arr[2].trim()};
	}
	var text = $(this.artistTrackSelector).text();
	var separator = this.findSeparator(text);

	var artist = null;
	var track = null;

	if (separator !== null) {
		artist = text.substr(0, separator.index);
		track = text.substr(separator.index + separator.length);
	}

	return {artist: artist, track: track};
};

Connector.isPlaying = function () {
	return $('.play').hasClass('pause');
};
