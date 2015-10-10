'use strict';

/* global Connector */

Connector.playerSelector = '#player';

Connector.trackArtImageSelector = '.s30 img';

Connector.artistSelector = '.currenttrack .artist > a';

Connector.trackSelector = '.currenttrack .title > a';

Connector.isPlaying = function () {
	return $('.pause').is(':visible');
};
