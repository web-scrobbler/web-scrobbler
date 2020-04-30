'use strict';

const trackArtSelector = '.Tuner__Audio__TrackDetail__img img';
const adSelector = '.Tuner__Audio__TrackDetail__title--ad';

Connector.playerSelector = '.region-bottomBar';

Connector.artistSelector = '.Tuner__Audio__TrackDetail__artist';

Connector.trackSelector = '.Tuner__Audio__TrackDetail__title';

Connector.durationSelector = 'span[data-qa="remaining_time"]';

Connector.getTrackArt = () => {
	const trackArtUrl = Util.extractImageUrlFromSelectors(trackArtSelector);
	if (trackArtUrl) {
		return trackArtUrl.replace('90W_90H', '500W_500H');
	}

	return null;
};

Connector.pauseButtonSelector = '[data-qa="pause_button"]';

Connector.isScrobblingAllowed = () => {
	return document.querySelector(adSelector) === null;
};
