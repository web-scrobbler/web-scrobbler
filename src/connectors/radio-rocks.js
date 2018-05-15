'use strict';

Connector.playerSelector = '.jp-gui';

Connector.artistSelector = '#singer0';

Connector.trackSelector = '#song0';

Connector.isPlaying = () => {
	return $('.jp-state-playing').length;
};
