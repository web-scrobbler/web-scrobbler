'use strict';

/* global Connector Util */

Connector.playerSelector = '.player-controls';

Connector.artistTrackSelector = '.player-controls > .video-title:first';

Connector.getArtistTrack = function () {
	var text = $(Connector.artistTrackSelector).text();
	return Util.processYoutubeVideoTitle(text);
};

Connector.isPlaying = function() {
	return $('button:contains(Pause Video)').length > 0;
};
