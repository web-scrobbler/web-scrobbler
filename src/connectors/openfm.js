'use strict';

Connector.playerSelector = '#openfm-player';

Connector.artistSelector = '#station-view .station-details > h3';

Connector.trackSelector = '#station-view .station-details > h2';

Connector.albumSelector = '#station-view .station-details > h4';

Connector.isPlaying = () => {
	return $('.controls-con > .stop-btn').length > 0;
};
