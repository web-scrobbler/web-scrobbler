'use strict';

/* global Connector */

Connector.playerSelector = '#onair_block';

Connector.artistSelector = '#nowplaying [id^=artiste_]';

Connector.trackSelector = '#nowplaying [id^=titre_]';

Connector.isPlaying = function () {
	return $('.jp-pause').is(':visible');
};
