'use strict';

/* global Connector */

Connector.playerSelector = '.player-container';

Connector.artistSelector = '#ArtistName';

Connector.trackSelector = '#SongName';

Connector.isPlaying = function () {
	return $('.fa-pause').length;
};
