'use strict';

Connector.playerSelector = '.player';

Connector.trackArtSelector = '#currently-playing-album-cover img';

Connector.artistSelector = '#currently-playing-composer';

Connector.trackSelector = '.currently-playing .movement';

Connector.albumSelector = '#currently-playing-work';

Connector.currentTimeSelector = '.progress span[title="Current Time"]';

/*
 * The connector has toggleable remaining time/duration.
 * Either duration or remaining time is visible at the moment.
 * If duration is hidden, we calculate it ising remaining time.
 */
Connector.getTimeInfo = () => {
	let duration = Util.stringToSeconds(
		Util.getTextFromSelectors('.progress span[title="Total Time"]')
	);
	const currentTime = Connector.getCurrentTime();

	if (!duration) {
		const remainingTime = Math.abs(Util.stringToSeconds(
			Util.getTextFromSelectors('.progress span[title="Remaining Time"]')
		));
		duration = remainingTime + currentTime;
	}

	return { currentTime, duration };
};

Connector.playButtonSelector = '#player-play-pause img[title="Play"]';
