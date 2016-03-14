'use strict';
/* global Connector */
Connector.playerSelector = 'body';
Connector.playButtonSelector = '.yr2-navbar-play';

Connector.artistSelector = '.yr2-navbar-player-metadata-info-artist';
Connector.trackSelector = '.yr2-navbar-player-metadata-info-song';
Connector.trackArtImageSelector = '.yr2-navbar-player-metadata-cover';

Connector.getTrackArt = function() {
	// Popup does not accepts URL without protocol
	return 'https:' + $(Connector.trackArtImageSelector).attr('src');
};
