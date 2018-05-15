'use strict';

Connector.playerSelector = '.jp-gui';

Connector.artistSelector = '#singer0';

Connector.trackSelector = '#song0';

Connector.playButtonSelector = '#myPlay';

Connector.isPlaying = () => {
	return $('.jp-state-playing').length;
};
