'use strict';

Connector.playerSelector = '.player';

Connector.artistSelector = `${Connector.playerSelector} .artiste`;

Connector.trackSelector = `${Connector.playerSelector} .titre`;

Connector.isPlaying = () => {
	return $('#jp_container_1').hasClass('jp-state-playing');
};
