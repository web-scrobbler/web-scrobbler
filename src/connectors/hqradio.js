'use strict';

Connector.playerSelector = '#controls';

Connector.artistSelector = '#track .artist';

Connector.trackSelector = '#track .title';

Connector.currentTimeSelector = '#status #time';

Connector.durationSelector = '#status #duration';

Connector.getUniqueID = () => {
	let trackUrl = $('#track').attr('href');
	if (trackUrl) {
		return trackUrl;
	}
	return null;
};

setInterval(() => {
	let timeRemaining = Connector.getDuration() - Connector.getCurrentTime();
	if (timeRemaining) {
		Connector.onStateChanged();
	}
}, 1000);

Connector.isPlaying = () => {
	return $('#controls #stop').hasClass('visible');
};
