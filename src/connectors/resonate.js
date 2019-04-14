'use strict';

Connector.playerSelector = '.player-component';

Connector.artistSelector = `${Connector.playerSelector} .track-artist`;

Connector.trackSelector = `${Connector.playerSelector} .track-title`;

Connector.currentTimeSelector = `${Connector.playerSelector} .currentTime`;

Connector.durationSelector = `${Connector.playerSelector} .duration`;

Connector.isPlaying = () => {
	return $('.play-button use').attr('xlink:href') === '#icon-pause';
};
