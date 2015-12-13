'use strict';

/* global Connector */

Connector.playerSelector = '#player_song';

Connector.artistSelector = '#player_artist';

Connector.trackSelector = '#player_title';


Connector.isPlaying = function () {
	return $('.play').is(':visible');
};
