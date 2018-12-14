'use strict';

Connector.playerSelector = '.play-bar';

Connector.trackSelector = '.music .info .title';

Connector.artistSelector = '.music .info .singers';

Connector.trackArtSelector = '.music .cover-link .active img';

Connector.getDuration = () => {
	let text = $('.audio-progress .range .bar .handle').val();
	let str = text.split('/');
	return str[0];
};

Connector.isPlaying = () => {
	return $('.main-control .play-btn').length !== 0;
};
