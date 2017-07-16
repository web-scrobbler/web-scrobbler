'use strict';

Connector.playerSelector = '#footer';

Connector.artistSelector = '.playing-song-meta';

Connector.trackSelector = '.playing-song-title';

Connector.isPlaying = () => {
	return $('.player-play.player-button .fa.fa-pause').is(':visible');
};

Connector.getUniqueID = () => {
	return $('.track-item.active.playing').prop('id');
};
