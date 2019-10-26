'use strict';

Connector.artistSelector = '.player .player__artist';

Connector.albumSelector = '.player__album-text > a';

Connector.trackSelector = '.player .player__title';

Connector.playerSelector = '.player';

Connector.isPlaying = () => {
	return $('.play-button--playing').length > 0;
};

Connector.currentTimeSelector = '.waveform__elapsed';

Connector.durationSelector = '.waveform__duration';
