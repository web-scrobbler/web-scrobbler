'use strict';

Connector.playerSelector = '#control-panel';

Connector.artistSelector = '.station-details > h3';

Connector.trackSelector = '.station-details > h2';

Connector.albumSelector = '.station-details > h4';

Connector.isPlaying = () => {
	return $('.controls-con > button').attr('class') !== 'play-btn';
};
