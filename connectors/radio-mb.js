'use strict';

/* global Connector */


Connector.playerSelector = '#radiomb';
Connector.artistSelector = '#radiomb-np-artist';
Connector.trackSelector = '#radiomb-np-title';
Connector.trackArtImageSelector = '#radiomb-top';


Connector.isPlaying = function () {
	return $('#radiomb-play').hasClass('radiomb-playing');
};
