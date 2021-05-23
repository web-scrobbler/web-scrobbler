'use strict';

let nextCue;
let cue;
let currentTime;
const mixDuration = Util.stringToSeconds(
	Util.getTextFromSelectors('.mediaTabItm:not(.hidden) .active')
		.split('[')[1]
		.split(']')[0]
);

Connector.playerSelector = '#playerWidgetFields';

Connector.getTrackArt = () =>
	Util.getAttrFromSelectors('.cPlay:first .artM', 'data-src');

Connector.albumSelector = '#pageTitle';

Connector.getUniqueID = () => Util.getAttrFromSelectors('.cPlay:first', 'id');

Connector.getArtistTrack = () => {
	const text = Util.getAttrFromSelectors(
		'.cPlay:first meta[itemprop="name"]',
		'content'
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
			return mixDuration - cue;
	}
};

Connector.isPlaying = () =>
	Util.hasElementClass('#playerWidgetPause', 'fa-pause');

Connector.isScrobblingAllowed = () => {
	nextCue = +Util.getAttrFromSelectors(
		'.cPlay:first ~ .tlpTog:first input',
		'value'
	);
	cue = +Util.getAttrFromSelectors('.cPlay:first input', 'value');
	currentTime = Util.getSecondsFromSelectors('#playerWidgetCurrentTime');
	const noIDs = Util.queryElements('.cPlay:first .redTxt').length;
	const mashup = Util.hasElementClass(
		'.cPlay:first span.trackValue',
		'mashupTrack'
	);

	return noIDs <= 0 && (cue > 0 || nextCue > 0) && !mashup;
};
