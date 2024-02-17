export {};

let nextCue: number;
let cue: number;
let currentTime: number;
const mixDuration = Util.stringToSeconds(
	Util.getTextFromSelectors('.mediaTabItm:not(.hidden) .active')
		?.split('[')[1]
		.split(']')[0],
);

Connector.playerSelector = '#playerWidgetFields';

Connector.getTrackArt = () =>
	Util.getAttrFromSelectors('.cPlay .artM', 'data-src');

Connector.albumSelector = '#pageTitle';

Connector.getUniqueID = () => Util.getAttrFromSelectors('.cPlay', 'id');

Connector.getArtistTrack = () => {
	const text = Util.getAttrFromSelectors(
		'.cPlay meta[itemprop="name"]',
		'content',
	);
	return Util.splitArtistTrack(text);
};

Connector.getCurrentTime = () => {
	return currentTime - cue;
};

Connector.getDuration = () => {
	switch (true) {
		case cue && nextCue > 0:
			0 > currentTime - cue && (nextCue += Math.abs(currentTime - cue));
			return nextCue - cue;
		case nextCue > 0:
			return nextCue;
		case cue > 0:
			return (mixDuration ?? 0) - cue;
	}
};

Connector.isPlaying = () =>
	Util.hasElementClass('#playerWidgetPause', 'fa-pause');

Connector.scrobblingDisallowedReason = () => {
	nextCue = parseInt(
		Util.getAttrFromSelectors('.cPlay ~ .tlpTog input', 'value') ?? '',
	);
	cue = parseInt(Util.getAttrFromSelectors('.cPlay input', 'value') ?? '');
	currentTime = Util.getSecondsFromSelectors('#playerWidgetCurrentTime') ?? 0;
	const noIDs = Util.queryElements('.cPlay .redTxt')?.length ?? 0;
	const mashup = Util.hasElementClass(
		'.cPlay span.trackValue',
		'mashupTrack',
	);

	return noIDs <= 0 && (cue > 0 || nextCue > 0) && !mashup ? null : 'Other';
};
