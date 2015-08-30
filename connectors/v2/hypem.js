'use strict';

/* global Connector */

Connector.playerSelector = '#player-controls';

Connector.artistSelector = '#player-nowplaying [href^="/artist/"]';

Connector.trackSelector = '#player-nowplaying [href^="/track/"]';

Connector.isPlaying = function () {
	return $('#playerPlay').hasClass('pause');
};
