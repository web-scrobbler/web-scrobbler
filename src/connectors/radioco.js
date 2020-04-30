'use strict';

Connector.playerSelector = '.radioco-player';

Connector.trackSelector = '.track-name';

Connector.artistSelector = '.track-artist';

Connector.trackArtSelector = '.current-artwork';

Connector.isPlaying = () => {
	return Util.hasElementClass('.radioco-player', 'playing');
};
