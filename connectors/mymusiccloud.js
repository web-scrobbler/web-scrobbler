'use strict';

/* global Connector */

Connector.playerSelector = '#player';

Connector.artistSelector = '#playerArtistName a';

Connector.trackSelector = '#playerTrackName a';

Connector.isPlaying = function () {
	return $('#playerPauseButton').is(':visible');
};
