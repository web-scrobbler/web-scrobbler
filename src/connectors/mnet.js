'use strict';

Connector.playerSelector = '#wrap';

Connector.artistSelector = '#tabArea .ItemTitle.selected .artist';

Connector.trackSelector = '#tabArea .ItemTitle.selected .titsong';

Connector.currentTimeSelector = '#player .progressControl .timeStart';

Connector.durationSelector = '#player .progressControl .timeEnd';

Connector.trackArtSelector = '#player .albumArea .albumImg img';

Connector.isPlaying = () => {
	return $('.playControl .btnPause').length !== 0;
};
