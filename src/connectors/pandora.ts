export {};

Connector.playerSelector = '.region-bottomBar';

Connector.artistSelector = '.Tuner__Audio__TrackDetail__artist';

Connector.trackSelector = '.Tuner__Audio__TrackDetail__title';

Connector.durationSelector = 'span[data-qa="remaining_time"]';

Connector.trackArtSelector = '.Tuner__Audio__TrackDetail__img img';

Connector.getTrackArt = () => {
	const trackArtUrl = Util.getAttrFromSelectors(
		'.Tuner__Audio__TrackDetail__img img',
		'src',
	);
	if (trackArtUrl) {
		return trackArtUrl.replace('90W_90H', '500W_500H');
	}

	return null;
};

Connector.pauseButtonSelector = '[data-qa="pause_button"]';

Connector.scrobblingDisallowedReason = () => {
	return document.querySelector('.Tuner__Audio__TrackDetail__title--ad')
		? 'IsAd'
		: null;
};
