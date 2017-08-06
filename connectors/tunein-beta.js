'use strict';

/* global Connector */

Connector.playerSelector = '.player__playerContainer___JEJ2U';
Connector.artistTrackSelector = '#playerTitle';
Connector.trackArtSelector = '#playerArtwork';

Connector.isPlaying = function () {
	return $('#playerActionButton').hasClass('playing');
};
