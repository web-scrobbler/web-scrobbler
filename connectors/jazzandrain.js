'use strict';

Connector.playerSelector = '#componentWrapper';

Connector.artistTrackSelector = '.fontMeasure';

Connector.isPlaying = () => {
	return $('.controls_toggle img').attr('src').includes('pause');
};
