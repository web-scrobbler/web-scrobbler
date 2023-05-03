export {};

const artistSelector = '.playbackSoundBadge__titleContextContainer > a';
const trackSelector = '.playbackSoundBadge__titleLink > span:nth-child(2)';
const trackArtSelector = '.playControls span.sc-artwork';
const durationSelector = '.playbackTimeline__duration > span:nth-child(2)';

Connector.playerSelector = '.playControls';

Connector.currentTimeSelector =
	'.playbackTimeline__timePassed > span:nth-child(2)';

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

Connector.getDuration = () => {
	const time = getDurationOrRemainingTime();
	return time && time > 0 ? time : null;
};

Connector.getRemainingTime = () => {
	const time = getDurationOrRemainingTime();
	return time && time < 0 ? time : null;
};

Connector.isPlaying = () => Util.hasElementClass('.playControl', 'playing');

Connector.getUniqueID = () => {
	return (
		document.querySelector(
			'.playbackSoundBadge__titleLink'
		) as HTMLAnchorElement
	).href;
};

Connector.getOriginUrl = () => {
	return Connector.getUniqueID();
};

const filterArtistPremiereRules = [
	{ source: /^\s*Premiere.*:\s*/i, target: '' },
	{ source: /^\s*\*\*Premiere\*\*\s*/i, target: '' },
];

const filterTrackPremiereRules = [{ source: /\[.*Premiere.*\]/i, target: '' }];

function filterArtistPremiere(text: string) {
	return MetadataFilter.filterWithFilterRules(
		text,
		filterArtistPremiereRules
	);
}

function filterTrackPremiere(text: string) {
	return MetadataFilter.filterWithFilterRules(text, filterTrackPremiereRules);
}

Connector.applyFilter(
	MetadataFilter.createYouTubeFilter().append({
		artist: filterArtistPremiere,
		track: filterTrackPremiere,
	})
);

function getDurationOrRemainingTime() {
	return Util.getSecondsFromSelectors(durationSelector);
}
