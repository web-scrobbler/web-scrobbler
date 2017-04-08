'use strict';

/* global Connector */

Connector.playerSelector = '#music_player';

Connector.artistSelector = '[data-role="artist"]';

Connector.trackSelector = '[data-role="title"]';

Connector.isPlaying = function () {
	return $('.btn_pause').is(':visible');
};
