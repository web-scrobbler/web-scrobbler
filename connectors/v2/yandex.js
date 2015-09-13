'use strict';

/* global Connector */

Connector.playerSelector = '.player-controls';

Connector.artistSelector = '.track_type_player .track__artists';

Connector.trackSelector = '.track_type_player .track__title';

Connector.isPlaying = function () {
	return $('.player-controls__btn_play').hasClass('player-controls__btn_pause');
};
