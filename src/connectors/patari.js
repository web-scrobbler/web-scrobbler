'use strict';

Connector.playerSelector = '.player';

Connector.artistSelector = `${Connector.playerSelector} .artistName`;

Connector.trackSelector = `${Connector.playerSelector} .songName`;

Connector.timeInfoSelector = '.rightWrapper';

Connector.isPlaying = () => {
	const playButtonImg = Util.getAttrFromSelectors('.playerPlay', 'src');
	return playButtonImg && playButtonImg.includes('pause');
};
