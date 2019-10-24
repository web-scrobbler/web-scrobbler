'use strict';

const artistSelector = '.playbackSoundBadge__titleContextContainer > a';
const trackSelector = '.playbackSoundBadge__titleLink > span:nth-child(2)';
const trackArtSelector = '.playControls span.sc-artwork';

Connector.playerSelector = '.playControls';

Connector.currentTimeSelector = '.playbackTimeline__timePassed > span:nth-child(2)';

Connector.durationSelector = '.playbackTimeline__duration > span:nth-child(2)';

Connector.getArtistTrack = () => {
	let { artist, track } = Util.processSoundCloudTrack(
		Util.getTextFromSelectors(trackSelector)
	);
	if (!artist) {
		artist = Util.getTextFromSelectors(artistSelector);
	}

	return { artist, track };
};

Connector.getTrackArt = () => {
	const trackArtUrl = Util.extractImageUrlFromSelectors(trackArtSelector);
	if (trackArtUrl) {
		return trackArtUrl.replace('-t50x50.', '-t200x200.');
	}

	return null;
};

Connector.isPlaying = () => $('.playControl').hasClass('playing');

Connector.applyFilter(MetadataFilter.getYoutubeFilter());
