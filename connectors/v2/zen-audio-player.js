'use strict';

/* global Connector, YoutubeFilter */


Connector.playerSelector = '#audioplayer';

Connector.artistTrackSelector = '#zen-video-title';

Connector.currentTimeSelector = '.plyr__time--current';

Connector.durationSelector = '.plyr__time--duration';

Connector.getUniqueID = function() {
	// Get the value of the search box
	return $('#v').val();
};

Connector.isPlaying = function() {
	return $('.plyr').hasClass('plyr--playing');
};

Connector.getArtistTrack = function () {
	var text = $(Connector.artistTrackSelector).text();

	var separator = Connector.findSeparator(text);

	if (separator === null || text.length === 0) {
		return {artist: null, track: null};
	}

	var artist =  text.substr(0, separator.index);
	var track = text.substr(separator.index + separator.length);

	return {artist: artist, track: track};
};

Connector.filter = YoutubeFilter;
