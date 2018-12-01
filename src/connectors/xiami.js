'use strict';

Connector.playerSelector = '.play-bar';

Connector.trackSelector = '.music .info .title';

Connector.artistSelector = '.music .info .singers';

Connector.playButtonSelector = '.main-control .play-btn';

Connector.currentTimeSelector = '.audio-progress .range .bar .handle';

Connector.trackArtSelector = '.music .cover-link .active img';

Connector.isPlaying = () => {
	return $('.main-control .play-btn').length !== 0;
};