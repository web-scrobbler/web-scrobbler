'use strict';

Connector.playerSelector = '.play-bar';

Connector.trackSelector = '.music .info .title';

Connector.artistSelector = '.music .info .singers';

Connector.trackArtSelector = '.music .cover-link .active img';

Connector.getUniqueID = () => $('.play-bar .content .title').attr('href').split('?')[0].split('/song/')[1];

Connector.timeInfoSelector = '.audio-progress .range .bar .handle';

Connector.isPlaying = () => {
	return $('.main-control .play-btn').length !== 0;
};
