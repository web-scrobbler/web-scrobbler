'use strict';

Connector.playerSelector = '.player';

Connector.trackArtSelector = '#currently-playing-album-cover img';

Connector.artistSelector = '#currently-playing-composer';

Connector.trackSelector = '.currently-playing .movement';

Connector.albumSelector = '#currently-playing-work';

Connector.currentTimeSelector = '#time_container_current';

Connector.getRemainingTime = () => {
	let time = Util.getTextFromSelectors('#toggle-remainging span');

	if (0 === time.indexOf('- ')) {
		return time.substr(2);
	}

	return time;
};

Connector.playButtonSelector = '#player-play-pause img[title="Play"]';
