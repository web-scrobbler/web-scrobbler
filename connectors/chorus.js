'use strict';

/* global Connector */

Connector.playerSelector = '#footer';

Connector.artistSelector = '.playing-song-meta';

Connector.trackSelector = '.playing-song-title';

Connector.isPlaying = function () {
	return $('.player-play.player-button .fa.fa-pause').is(':visible');
};

Connector.getUniqueID = function () {
	return $('.track-item.active.playing').prop('id');
};
