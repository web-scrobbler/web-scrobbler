'use strict';

/* global Connector */

Connector.playerSelector = '#playerContents';

Connector.artistSelector = '#songartist';

Connector.trackSelector = '#songtitle';

Connector.albumSelector = '#albumtitle';

Connector.getTrackArt = function () {
	var trackArtUrl = $('#albumArtImg').attr('src');
	return  trackArtUrl !== null ? 'http:' + trackArtUrl : null;
};

Connector.isPlaying = function () {
	return $('#playerPauseButton').length;
};
