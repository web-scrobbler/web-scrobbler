'use strict';

Connector.playerSelector = '.player';

Connector.artistSelector = `${Connector.playerSelector} .artiste`;

Connector.trackSelector = `${Connector.playerSelector} .titre`;

Connector.isPlaying = () => {
	return Util.hasElementClass('#jp_container_1', 'jp-state-playing');
};
