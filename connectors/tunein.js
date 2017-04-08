'use strict';

/* global Connector */

Connector.playerSelector = '.container';

Connector.artistTrackSelector = '.line1._navigateNowPlaying';

Connector.trackArtImageSelector = '.album.logo';

Connector.isPlaying = function () {
	return $('#tuner').hasClass('playing');
};
