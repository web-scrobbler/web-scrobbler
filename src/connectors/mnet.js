'use strict';

Connector.playerSelector = '#wrap';

Connector.artistSelector = '#tabArea .ItemTitle.selected .artist';

Connector.trackSelector = '#tabArea .ItemTitle.selected .titsong';

Connector.currentTimeSelector = '#player .progressControl .timeStart';

Connector.durationSelector = '#player .progressControl .timeEnd';

Connector.isPlaying = () => {
	return $('.playControl .btnPause').length !== 0;
};

Connector.getTrackArt = () => {
	return `${$('#player .albumArea .albumImg').find('img').attr('src')}`;
};
