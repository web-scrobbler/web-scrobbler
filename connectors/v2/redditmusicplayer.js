'use strict';

/* global Connector */

Connector.playerSelector = '.ui.controls';

Connector.artistTrackSelector = '.ui.item.active .title';

Connector.currentTimeSelector = '.item.start.time';

Connector.isPlaying = function() {
	return $('.item.play.button').hasClass('active');
};

Connector.getUniqueID = function() {
	return $('.ui.item.active').attr('data-id');
};
