'use strict';

Connector.playerSelector = '.play-bar';

Connector.trackSelector = '.music .info .title';

Connector.artistSelector = '.music .info .singers';

Connector.trackArtSelector = '.music .cover-link .active img';

Connector.timeInfoSelector = '.audio-progress .range .bar .handle';

Connector.isPlaying = () => {
	return $('.main-control .play-btn').length !== 0;
};
