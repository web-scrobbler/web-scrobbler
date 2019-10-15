'use strict';

/**
 * Regular expression used to split artist and track.
 * There're three different '-' chars in the regexp:
 * hyphen (0x2d), en dash (0x2013), em dash (0x2014).
 * @type {Object}
 */
const artistTrackRe = /(.+)\s[-–—:]\s(.+)/;

const artistSelector = '.playbackSoundBadge__titleContextContainer > a';
const trackSelector = '.playbackSoundBadge__titleLink > span:nth-child(2)';
const trackArtSelector = '.playControls span.sc-artwork';

Connector.playerSelector = '.playControls';

Connector.currentTimeSelector = '.playbackTimeline__timePassed > span:nth-child(2)';

Connector.durationSelector = '.playbackTimeline__duration > span:nth-child(2)';

Connector.getArtistTrack = () => {
	const track = Util.getTextFromSelectors(trackSelector);

	/*
	 * Sometimes the artist name is in the track title,
	 * e.g. Tokyo Rose - Zender Overdrive by Aphasia Records.
	 */
	const match = artistTrackRe.exec(track);

	/*
	 * But don't interpret patterns of the form
	 * "[Start of title] #1234 - [End of title]" as Artist - Title
	 */
	if (match && ! /.*#\d+.*/.test(match[1])) {
		return {
			artist: match[1], track: match[2]
		};
	}

	const artist = Util.getTextFromSelectors(artistSelector);

	return { artist, track };
};

Connector.getTrackArt = () => {
	const trackArtUrl = Util.extractImageUrlFromSelectors(trackArtSelector);
	return trackArtUrl.replace('-t50x50.', '-t200x200.');
};

Connector.isPlaying = () => $('.playControl').hasClass('playing');

Connector.applyFilter(MetadataFilter.getYoutubeFilter());
