'use strict';

/* global Connector */

Connector.playerSelector = '#page_layout';

Connector.artistSelector = '#song_panel_artist';

Connector.trackSelector = '#song_panel_title';

Connector.isPlaying = function () {
	return $('#pause_button').is(':visible');
};
