'use strict';

Connector.playerSelector = '#radio-player';

Connector.artistSelector = 'li.playing .artist';

Connector.trackSelector = 'li.playing .song';

Connector.playButtonSelector = '#radio-controls .icon-player-play';

Connector.currentTimeSelector = '.jp-current-time';

Connector.durationSelector = '.jp-duration';

Connector.getUniqueID = () => {
	let idMatch = /\/(\d+)\.mp3/.exec($('audio').attr('src'));
	return idMatch ? idMatch[1] : null;
};
