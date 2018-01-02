'use strict';

Connector.playerSelector = 'body';

Connector.playButtonSelector = '.yr2-navbar-play';

Connector.artistSelector = '.yr2-navbar-player-metadata-info-artist';

Connector.trackSelector = '.yr2-navbar-player-metadata-info-song';

Connector.trackArtSelector = '.yr2-navbar-player-metadata-cover';

Connector.getTrackArt = () => {
	// Popup does not accepts URL without protocol
	return `https:${$(Connector.trackArtSelector).attr('src')}`;
};
