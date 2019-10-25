'use strict';

Connector.playerSelector = '.player__inner';

Connector.currentTimeSelector = '.player__waveform .waveform__elapsed';

Connector.trackSelector = '.player__title';

Connector.durationSelector = '.player__waveform .waveform__duration';

Connector.artistSelector = '.player__artist';

Connector.playButtonSelector = '.player__controls > .play-button--paused';

Connector.getTrackArt = () => {
	const trackArt = $('.avatar-container img').attr('src');
	if (!trackArt) {
		return null;
	}
	const endIdx = trackArt.includes('?') ? trackArt.indexOf('?') : trackArt.length;
	return trackArt.substr(0, endIdx);
};
