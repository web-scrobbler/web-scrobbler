'use strict';

let nextCue;
let cue;
let currentTime;
const mixDuration = Util.stringToSeconds($('.mediaTabItem:first span').text().split('[')[1].trim().slice(0, -1));

Connector.playerSelector = '.playerWidgetMessage';

Connector.trackArtSelector = '#artworkLeft';

Connector.albumSelector = '#pageTitle';

Connector.getUniqueID = () => $('.cPlay:first').attr('id');

Connector.getArtistTrack = () => {
	let text = $('.cPlay:first meta[itemprop="name"]').attr('content');
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

Connector.isPlaying = () => {
	return $('#playerWidgetPause').hasClass('fa-pause');
};

Connector.isScrobblingAllowed = () => {
	nextCue = Util.stringToSeconds($('.cPlay:first').nextAll('.topBorder').find('.cueValueField:contains(":")').eq(0).text());
	cue = Util.stringToSeconds($('.cPlay:first').find('.cueValueField').text());
	currentTime = Util.stringToSeconds($('#playerWidgetCurrentTime').text());
	let noIDs = $('.cPlay:first').find('.trackFormat .redTxt').length;

	return noIDs <= 0 && (cue > 0 || nextCue > 0);
};
