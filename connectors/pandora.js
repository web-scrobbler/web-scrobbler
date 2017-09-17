'use strict';

Connector.playerSelector = '.region-bottomBar';

Connector.artistSelector = '.Tuner__Audio__TrackDetail__artist';

Connector.trackSelector = '.Tuner__Audio__TrackDetail__title';

Connector.durationSelector = 'span[data-qa="remaining_time"]';

Connector.trackArtSelector = '.Tuner__Audio__TrackDetail__img img';

Connector.getTrackArt = () => {
	let trackArtUrl = $('.Tuner__Audio__TrackDetail__img img').attr('src');
	if (trackArtUrl) {
		return trackArtUrl.replace('90W_90H', '500W_500H');
	}

	return null;
};

Connector.isPlaying = () => {
	let playButtonHref = $('.PlayButton use').attr('xlink:href');
	return playButtonHref.includes('pause');
};

Connector.isScrobblingAllowed = () => {
	return $('.Tuner__Audio__TrackDetail__title--ad').length === 0;
};
