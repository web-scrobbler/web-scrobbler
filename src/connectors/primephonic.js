'use strict';

Connector.playerSelector = '.player';

Connector.trackArtSelector = '#currently-playing-album-cover img';

Connector.artistSelector = '#currently-playing-composer';

Connector.trackSelector = '.currently-playing .movement';

Connector.albumSelector = '#currently-playing-work';

Connector.currentTimeSelector = '.progress span[title="Current Time"]';

Connector.getTimeInfo = () => {
	let currentTime = Connector.getCurrentTime();
	let duration = Util.stringToSeconds(Util.getTextFromSelectors('#toggle-remainging span'));

	// check if it's actually remaining time
	if (duration < 0) {
		duration = currentTime - duration;
	}

	return { currentTime, duration };
};

Connector.playButtonSelector = '#player-play-pause img[title="Play"]';
