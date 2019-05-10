'use strict';

Connector.playerSelector = '#footer .player';

Connector.artistSelector = '.info .pado_tit_wrap span:first-child';

Connector.trackSelector = '.pado_tit_wrap strong:first';

Connector.currentTimeSelector = '#progress .now';

Connector.durationSelector = '#progress .total';

Connector.isPlaying = () => {
	return $('#controller .pause').length !== 0;
};

Connector.trackArtSelector = '#playerWrap #cover img';
