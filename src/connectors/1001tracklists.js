'use strict';

let nextCue;
let cue;
let currentTime;
const mixDuration = Util.stringToSeconds($('.mediaTabItem span').text().split('[')[1].split(']')[0]);

Connector.playerSelector = '#playerWidgetFields';

Connector.trackArtSelector = '#artworkLeft';

Connector.albumSelector = '#pageTitle';

Connector.getUniqueID = () => $('.cPlay:first').attr('id');

Connector.getArtistTrack = () => {
	const text = $('.cPlay:first meta[itemprop="name"]').attr('content');
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
	nextCue = +$('.cPlay:first').nextAll('.topBorder').find('input').eq(0).val();
	cue = +$('.cPlay:first input').val();
	currentTime = Util.stringToSeconds($('#playerWidgetCurrentTime').text());
	const noIDs = $('.cPlay:first').find('.trackFormat .redTxt').length;

	return noIDs <= 0 && (cue > 0 || nextCue > 0);
};
