'use strict';

/* global Connector, Util */

Connector.playerSelector = '.player__main';

Connector.artistTrackSelector = 'span.title--title';

Connector.getArtistTrack = function() {
	var text = $(Connector.artistTrackSelector).text();
	var m = text.match(/\"(.*)\" von (.*)/);
	if (m && (m.length === 3)) {
		return {artist: m[2], track: m[1]};
	}
	return Util.splitArtistTrack(text);
};

Connector.isPlaying = function () {
	return $('.jp-audio').hasClass('jp-state-playing');
};
