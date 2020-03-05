'use strict';

Connector.playerSelector = '#player-controlls';
Connector.pauseButtonSelector = '.fa-pause';
Connector.durationSelector = '.track-length';
Connector.artistSelector = '.jp-artists';

const trackSelector = '.jp-title';
Connector.getTrack = () => {
	return Util.getTextFromSelectors(trackSelector);
};
