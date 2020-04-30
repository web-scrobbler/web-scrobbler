'use strict';

Connector.playerSelector = '#player-section';

Connector.artistTrackSelector = '.fp-title';

Connector.isPlaying = () => {
	return Util.getAttrFromSelectors('.fp-playbtn', 'title') === 'Pause';
};

Connector.currentTimeSelector = '.fp-elapsed';

Connector.durationSelector = '.fp-duration';
