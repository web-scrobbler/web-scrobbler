'use strict';

Connector.playerSelector = '#componentWrapper';

Connector.artistTrackSelector = '.fontMeasure';

Connector.isPlaying = () => {
	const playButtonImg = Util.getAttrFromSelectors('.controls_toggle img', 'src');
	return playButtonImg && playButtonImg.includes('pause');
};
