'use strict';

/* global Connector */

Connector.playerSelector = '.jp-gui.jp-interface';

Connector.trackArtImageSelector = '#current_song_album';

Connector.artistTrackSelector = '.media_songtitle';

Connector.isPlaying = function () {
	return $('.jp-pause').is(':visible');
};
