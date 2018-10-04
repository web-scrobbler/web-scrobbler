'use strict';

Connector.playerSelector = '#footer .player';

Connector.artistSelector = '.info .pado_tit_wrap span:nth-child(2)';

Connector.trackSelector = '.pado_tit_wrap strong:first';

Connector.currentTimeSelector = '#progress .now';

Connector.durationSelector = '#progress .total';

Connector.isPlaying = () => {
	return $('#controller .pause').length !== 0;
};

Connector.getTrackArt = () => {
	return `http:${$('#playerWrap #cover').find('img').attr('src')}`;
};
