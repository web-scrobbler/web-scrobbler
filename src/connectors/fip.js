'use strict';

Connector.playerSelector = '.player';

Connector.artistSelector = '.playing-now .now-info-subtitle';

Connector.trackSelector = '.playing-now .now-info-title';

Connector.albumSelector = '.playing-now .now-info-details-value';

Connector.trackArtSelector = '.playing-now .playing-now-cover img';

Connector.isPlaying = () => {
	return $('.playing-now button.live-button').hasClass('pause');
};
